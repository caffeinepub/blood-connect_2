import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type BloodGroup = {
    #A_Positive;
    #A_Negative;
    #B_Positive;
    #B_Negative;
    #O_Positive;
    #O_Negative;
    #AB_Positive;
    #AB_Negative;
  };

  type UserRole = {
    #donor;
    #receiver;
  };

  type UserProfile = {
    name : Text;
    role : UserRole;
    bloodGroup : BloodGroup;
    phone : Text;
    city : Text;
    age : Nat;
    lastDonationDate : ?Time.Time;
    active : Bool;
    createdAt : Time.Time;
    lastActive : Time.Time;
  };

  type EmergencyRequest = {
    requester : Text;
    bloodGroup : BloodGroup;
    city : Text;
    timestamp : Time.Time;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let users = Map.empty<Principal, UserProfile>();
  let emergencyRequests = List.empty<EmergencyRequest>();

  // Required by instructions: get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    users.get(caller);
  };

  // Required by instructions: save the caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    users.add(caller, profile);
  };

  // Required by instructions: get another user's profile (caller can view own, admin can view any)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  // Registration is open to any caller (including guests) so new users can sign up.
  // The MixinAuthorization mixin will assign the #user role upon registration.
  public shared ({ caller }) func registerUser(
    name : Text,
    role : UserRole,
    bloodGroup : BloodGroup,
    phone : Text,
    city : Text,
    age : Nat,
    lastDonationDate : ?Time.Time,
  ) : async () {
    let profile : UserProfile = {
      name;
      role;
      bloodGroup;
      phone;
      city;
      age;
      lastDonationDate;
      active = true;
      createdAt = Time.now();
      lastActive = Time.now();
    };
    users.add(caller, profile);
  };

  // Donor search is a read operation open to any caller (guests included),
  // so potential recipients can search without needing an account.
  public query func smartDonorSearch(requiredBloodGroup : BloodGroup, city : Text) : async [UserProfile] {
    let results = List.empty<UserProfile>();
    for ((_, profile) in users.entries()) {
      if (profile.bloodGroup == requiredBloodGroup and profile.city == city and profile.active) {
        results.add(profile);
      };
    };
    results.toArray();
  };

  // Creating an emergency request requires an authenticated user (#user role).
  public shared ({ caller }) func createEmergencyRequest(requester : Text, bloodGroup : BloodGroup, city : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create emergency requests");
    };
    let emergency : EmergencyRequest = {
      requester;
      bloodGroup;
      city;
      timestamp = Time.now();
    };
    emergencyRequests.add(emergency);
  };

  // Dashboard data requires an authenticated user (#user role) since it uses the caller's city.
  public query ({ caller }) func getDashboardData() : async {
    totalDonors : Nat;
    nearbyDonors : [UserProfile];
    recentRequests : [EmergencyRequest];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view the dashboard");
    };

    let totalDonors = users.size();
    let currentUserCity = switch (users.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile.city };
    };

    let nearbyDonors = List.empty<UserProfile>();
    for ((_, profile) in users.entries()) {
      if (profile.city == currentUserCity and profile.active) {
        nearbyDonors.add(profile);
      };
    };

    let recentRequests = List.empty<EmergencyRequest>();
    var count = 0;
    for (request in emergencyRequests.values()) {
      if (count < 5) {
        recentRequests.add(request);
        count += 1;
      };
    };

    {
      totalDonors;
      nearbyDonors = nearbyDonors.toArray();
      recentRequests = recentRequests.toArray();
    };
  };

  // Admin panel is restricted to admins only.
  public query ({ caller }) func getAdminPanelData() : async {
    users : [UserProfile];
    emergencyRequests : [EmergencyRequest];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    let usersList = List.empty<UserProfile>();
    for ((_, profile) in users.entries()) {
      usersList.add(profile);
    };
    { users = usersList.toArray(); emergencyRequests = emergencyRequests.toArray() };
  };

  // Deactivating a user is restricted to admins only.
  public shared ({ caller }) func deactivateUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can deactivate users");
    };
    switch (users.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        users.add(user, { profile with active = false });
      };
    };
  };
};

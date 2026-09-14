// Static placeholder data for the profile page. Stands in for fields the
// backend's AppUser doesn't carry yet (employee id, department, role title,
// avatar) — everything else on the page (name, email, status, join date,
// stats, training progress, recent evaluations) is sourced live from the API.

export type ProfileData = {
  employeeId: string;
  roleLabel: string;
  department: string;
  avatarUrl: string;
};

export const profileData: ProfileData = {
  employeeId: "EMP-1048",
  roleLabel: "সেলস অফিসার",
  department: "Enterprise Sales",
  avatarUrl: "https://picsum.photos/seed/employee-profile/300/300",
};

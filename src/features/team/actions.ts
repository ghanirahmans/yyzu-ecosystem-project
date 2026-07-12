"use server";

import { revalidatePath } from "next/cache";
import { validateActiveUser } from "@/lib/guards";
import { teamSchema, usefulLinkSchema, submissionSchema, reviewSubmissionSchema } from "./schema";
import * as teamService from "./service";

// ---------------------------------------------------------------------------
// Invitation actions
// ---------------------------------------------------------------------------

export async function acceptInvitationAction(invitationId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.acceptInvitation(actor, invitationId);
    if (result.success) revalidatePath("/dashboard");
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function rejectInvitationAction(invitationId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.rejectInvitation(actor, invitationId);
    if (result.success) revalidatePath("/dashboard");
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

// ---------------------------------------------------------------------------
// Join request actions
// ---------------------------------------------------------------------------

export async function sendJoinRequestAction(teamId: string, message?: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.sendJoinRequest(actor, teamId, message);
    if (result.success) {
      revalidatePath("/dashboard/teams");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function cancelJoinRequestAction(requestId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.cancelJoinRequest(actor, requestId);
    if (result.success) {
      revalidatePath("/dashboard/teams");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function approveJoinRequestAction(requestId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.approveJoinRequest(actor, requestId);
    if (result.success) {
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function rejectJoinRequestAction(requestId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.rejectJoinRequest(actor, requestId);
    if (result.success) revalidatePath("/dashboard/team");
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

// ---------------------------------------------------------------------------
// Team CRUD actions
// ---------------------------------------------------------------------------

export async function createTeamAction(data: { name: string; description?: string }) {
  try {
    const actor = await validateActiveUser();

    const validation = teamSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "INVALID_INPUTS" };
    }

    const result = await teamService.createTeam(actor, validation.data);
    if (result.success) {
      revalidatePath("/dashboard/teams");
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function updateTeamInfoAction(data: { name: string; description?: string }) {
  try {
    const actor = await validateActiveUser();

    const validation = teamSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "INVALID_INPUTS" };
    }

    const result = await teamService.updateTeamInfo(actor, validation.data);
    if (result.success) {
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard/team/settings");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function deleteTeamAction(confirmName: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.deleteTeam(actor, confirmName);
    if (result.success) {
      revalidatePath("/dashboard/teams");
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

// ---------------------------------------------------------------------------
// Member management actions
// ---------------------------------------------------------------------------

export async function inviteMemberAction(username: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.inviteMember(actor, username);
    if (result.success) revalidatePath("/dashboard/team");
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function removeMemberAction(userIdToDelete: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.removeMember(actor, userIdToDelete);
    if (result.success) {
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function leaveTeamAction() {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.leaveTeam(actor);
    if (result.success) {
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function transferLeadershipAction(newLeaderUserId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.transferLeadership(actor, newLeaderUserId);
    if (result.success) {
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard/team/settings");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

// ---------------------------------------------------------------------------
// Useful link actions
// ---------------------------------------------------------------------------

export async function addUsefulLinkAction(data: {
  title: string;
  url: string;
  category: string;
  notes?: string;
}) {
  try {
    const actor = await validateActiveUser();

    const validation = usefulLinkSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "INVALID_INPUTS" };
    }

    const result = await teamService.addUsefulLink(actor, validation.data);
    if (result.success) revalidatePath("/dashboard/team");
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function deleteUsefulLinkAction(linkId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.deleteUsefulLink(actor, linkId);
    if (result.success) revalidatePath("/dashboard/team");
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

// ---------------------------------------------------------------------------
// Submission actions
// ---------------------------------------------------------------------------

export async function updateSubmissionAction(data: { submissionLink: string }) {
  try {
    const actor = await validateActiveUser();

    const validation = submissionSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "INVALID_INPUTS" };
    }

    const result = await teamService.updateSubmission(actor, validation.data);
    if (result.success) {
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function reviewSubmissionAction(
  teamId: string,
  status: "APPROVED" | "REVISION",
  feedback?: string
) {
  try {
    const actor = await validateActiveUser();

    const validation = reviewSubmissionSchema.safeParse({ teamId, status, feedback });
    if (!validation.success) {
      return { success: false, error: "INVALID_INPUTS" };
    }

    const result = await teamService.reviewSubmission(
      actor,
      validation.data.teamId,
      validation.data.status,
      validation.data.feedback
    );

    if (result.success) {
      revalidatePath("/dashboard/team");
      revalidatePath(`/dashboard/teams/${teamId}`);
      revalidatePath("/dashboard/teams");
      revalidatePath("/dashboard");
    }

    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

// ---------------------------------------------------------------------------
// Org link actions
// ---------------------------------------------------------------------------

export async function addOrgLinkAction(data: {
  title: string;
  url: string;
  category: string;
  notes?: string;
}) {
  try {
    const actor = await validateActiveUser();

    const validation = usefulLinkSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "INVALID_INPUTS" };
    }

    const result = await teamService.addOrgLink(actor, validation.data);
    if (result.success) {
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/admin/links");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function deleteOrgLinkAction(linkId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.deleteOrgLink(actor, linkId);
    if (result.success) {
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/admin/links");
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

// ---------------------------------------------------------------------------
// Division link actions
// ---------------------------------------------------------------------------

export async function addDivisionLinkAction(
  divisionId: string,
  data: { title: string; url: string; category: string; notes?: string }
) {
  try {
    const actor = await validateActiveUser();

    const validation = usefulLinkSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "INVALID_INPUTS" };
    }

    const result = await teamService.addDivisionLink(actor, divisionId, validation.data);
    if (result.success) {
      revalidatePath(`/dashboard/divisions/${divisionId}`);
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

export async function deleteDivisionLinkAction(linkId: string, divisionId: string) {
  try {
    const actor = await validateActiveUser();
    const result = await teamService.deleteDivisionLink(actor, linkId, divisionId);
    if (result.success) {
      revalidatePath(`/dashboard/divisions/${divisionId}`);
    }
    return result;
  } catch {
    return { success: false, error: "UNAUTHORIZED" };
  }
}

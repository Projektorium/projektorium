// src/services/ProjectRightsService.ts

import {ProjectStatus} from "@/client/types.gen.ts";

export enum ProjectRights {
  READ = 1,
  WRITE = 2,
  DELETE = 4,
  MANAGE = 8,
  ADMIN = 16
}

/**
 * Service for handling project permissions
 */
export class ProjectRightsService {
  /**
   * Check if user has read access to a project
   * @param permissions User's permission flags
   * @returns True if user can read the project
   */
  public static canRead(permissions: number | undefined | null): boolean {
    if (!permissions) return false;
    return (
      (permissions & ProjectRights.READ) === ProjectRights.READ ||
      ProjectRightsService.isAdmin(permissions)
    );
  }

  /**
   * Check if user has write access to a project
   * @param permissions User's permission flags
   * @returns True if user can edit the project
   */
  public static canWrite(permissions: number | undefined | null): boolean {
    if (!permissions) return false;
    return (
      (permissions & ProjectRights.WRITE) === ProjectRights.WRITE ||
      ProjectRightsService.isAdmin(permissions)
    );
  }

  /**
   * Check if user has admin access to a project
   * @param permissions User's permission flags
   * @returns True if user has admin rights
   */
  public static isAdmin(permissions: number | undefined | null): boolean {
    if (!permissions) return false;
    return (permissions & ProjectRights.ADMIN) === ProjectRights.ADMIN;
  }

  public static checkIfActive(status: ProjectStatus): boolean {
    return status != "Inactive";
  }
}
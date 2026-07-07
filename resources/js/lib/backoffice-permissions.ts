export function hasBackofficePermission(
    permissions: readonly string[],
    permission: string,
): boolean {
    return permissions.includes(permission);
}

export function canAccessBackofficeFeature(
    permissions: readonly string[],
    feature: string,
): boolean {
    return permissions.some((permission) =>
        permission.startsWith(`${feature}.`),
    );
}

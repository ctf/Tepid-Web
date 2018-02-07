export const buildToken = auth => window.btoa(`${auth.user.shortUser}:${auth.session.id}`);

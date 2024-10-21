import { Request, Response, NextFunction } from 'express';

function authorizeRoles(allowedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const userRole = response.locals.userRole;
    if (!userRole) {
      return response.status(403).json({ message: 'Forbidden: User role not found' });
    }

    if (allowedRoles.includes(userRole)) {
      return next();
    } else {
      return response.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }
  };
}

export default authorizeRoles;

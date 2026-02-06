import { router } from '../../lib/trpc/trpc';
import { getUsers, getUserById, createUser, updateProfile, deleteUser } from './users.procedures';

// TODO: Add JSDoc comments for router documentation
// TODO: Consider adding router-level middleware for common validations
// TODO: Add OpenAPI/Swagger documentation generation
export const usersRouter = router({
    // CRUD Operations
    createUser, // CREATE
    getUsers, // READ (all)
    getUserById, // READ (by ID)
    updateProfile, // UPDATE
    deleteUser // DELETE
});

export type UsersRouter = typeof usersRouter;

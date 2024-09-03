import { randomUUID } from "crypto";

// ダミーデータ
const users = [
  { id: "1", name: "user", email: "user@email.com" },
  { id: "2", name: "guest", email: "guest@email.com" },
];

// リゾルバーの定義
export const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    createUser: (_parent: any, args: any, _context: any, _info: any) => {
      const newUser = {
        id: randomUUID(),
        name: args.input.name,
        email: args.input.email,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

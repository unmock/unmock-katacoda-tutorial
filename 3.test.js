const unmock = require("unmock");
const runner = require("unmock-jest-runner").default;
const getUsersForUI = require("./users");

const {
  u
} = unmock;

unmock
  .default
  .nock("https://api.example.com/v1", "example")
  .get("/users")
  .reply(200, {
    users: u.array(u.type({
      id: u.number(),
      name: u.string()
    }, {
      zodiac: u.type({
        sign: u.string(),
      }, {
        ascendant: u.string()
      })
    }))
  });

let example;
beforeAll(() => {
  example = unmock.default.on().services.example;
});

test("getUsersForUI should augment response with custom fields", runner(async () => {
  const usersForUI = await getUsersForUI();
  const responseBody = example.spy.getResponseBody();

  const { users } = JSON.parse(responseBody);
  const augmentedResponse = {
    newlyFetched: true,
    timestamp: expect.any(Number),
    users: users.map(elt => ({ ...elt, seen: false }))
  }

  expect(usersForUI).toMatchObject(augmentedResponse);
}));

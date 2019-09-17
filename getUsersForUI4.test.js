const unmock = require("unmock");
const axios = require("axios");

const {
  gen: { withCodes, responseBody },
  runner
} = unmock;

let petstore;
beforeAll(() => {
  petstore = unmock.default.on().services.petstore;
});

test("usersForUI should augment resposne with custom fields", runner(async () => {
  petstore.state(
    withCodes(200),
    // convert the list to a tuple with 42 indexable entries
    responseBody().listToTuple(42),
    // make the 15th entry of the list have the name "Fluffy"
    responseBody({ address: [ 15, "name" ]}).const("Fluffy")
  );
  const { data } = await axios("http://petstore.swagger.io/v1/pets");
  expect(data.length).toBe(42);
  expect(data[15].name).toBe("Fluffy");
}));
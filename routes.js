import Users from './db/config';

const addUser = async email =>
  new Users({ email }).save();

const findOrAddUser = async ({ query: { email } }, res) => {
  let user = await Users
    .findOne({ email })
    .exec();
  if (!user) user = await addUser(email);
  res.status(200).send(user);
};

const addReference = async (req, res) => {
  const { body: { refId, userId } } = req;
  try {
    const user = await Users
      .findById(userId)
      .exec();
    user.references.push(refId);
    await user.save();
    res.status(200).send(`Added ${refId}`);
  } catch (err) {
    res.status(400).send('User not found');
  }
};

const removeReference = async (req, res) => {
  const { body: { refId, userId } } = req;
  try {
    const user = await Users
      .findById(userId)
      .exec();
    const i = user.references.indexOf(refId);
    user.references.splice(i, 1);
    await user.save();
    res.status(200).send(`Removed ${refId}`);
  } catch (err) {
    res.status(400).send('User not found');
  }
};

export {
  findOrAddUser,
  addReference,
  removeReference,
  addUser
};

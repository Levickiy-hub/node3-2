const fs = require('fs');

let phoneList;
let person;

fs.readFile('./db/phonebook.json', (err, data) => {
  if (err) {
    console.error(`Read "phonebook.json"\n${err}`);
    throw err;
  }
  phoneList = JSON.parse(data.toString());
});

const saveFile = () => {
  fs.writeFile('./db/phonebook.json', JSON.stringify(phoneList, null, 4), (err) => {
    if (err) {
      console.error(`Write "phonebook.json"\n${err}`);
      throw err;
    }
  });
};

const findAll = () => phoneList;

const Add = (dataObj) => {
  const { name, number } = dataObj;
  if (name && number) {
    if (phoneList.find((user) => user.number == number)) throw new Error('This number is already registered');
    else {
      phoneList.push({ name, number });
      saveFile();
    }
  }
};

const Update = async (dataObj) => {
  const { name, number, oldNumber } = dataObj;
  console.log(name, number, oldNumber);
  if (name && number && oldNumber) {
    person = phoneList.find((user) => user.number == oldNumber);
    if (!person) throw new Error('Phone number not found');
    console.log(person);
    person.name = name;
    person.number = number;
    saveFile();
  }
};

const Delete = (number) => {
  person = phoneList.find((user) => user.number == number);
  if (!person) throw new Error('Phone number not found');

  phoneList = phoneList.filter((user) => user.number != number);
  saveFile();
};

module.exports = {
  findAll, Add, Update, Delete,
};

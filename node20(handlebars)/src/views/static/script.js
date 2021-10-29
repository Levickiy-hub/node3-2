let oldNumber = '';

function disableDel() {
  console.log('c');
  const del = document.getElementById('delete');

  if (del) {
    del.disabled = true;
  }
}

function Add() {
  const Pnumber = document.getElementById('Pnumber').value;
  const FIO = document.getElementById('FIO').value;

  const LINK = '/Add';
  fetch(LINK, {
    method: 'Post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: FIO,
      number: Pnumber,
    }),
  })
    .then(() => { location.reload(); })
    .catch((err) => console.log(`Fetch ERROR by ${LINK}: ${err}`));
}

function Delete() {
  const Pnumber = document.getElementById('Pnumber').value;

  const LINK = '/Delete';
  fetch(LINK, {
    method: 'Post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      number: Pnumber,
    }),
  })
    .then(() => { location.reload(); })
    .catch((err) => console.log(`Fetch ERROR by ${LINK}: ${err}`));
}

function Change(item) {
  const back = document.getElementById('back');
  const del = document.getElementById('delete');
  if (del) {
    del.disabled = false;

    const Pnumber = document.getElementById('Pnumber');
    const FIO = document.getElementById('FIO');

    FIO.value = item.querySelector('#list-fio').innerHTML;
    Pnumber.value = item.querySelector('#list-number').innerHTML;

    oldNumber = Pnumber.value;
  } else if (!back || del) {
    location.href = '/Update';
  }
}

function Update() {
  const Pnumber = document.getElementById('Pnumber').value;
  const FIO = document.getElementById('FIO').value;

  const LINK = '/Update';
  fetch(LINK, {
    method: 'Post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: FIO,
      number: Pnumber,
      oldNumber,
    }),
  })
    .then(() => { location.reload(); })
    .catch((err) => console.log(`Fetch ERROR by ${LINK}: ${err}`));
}

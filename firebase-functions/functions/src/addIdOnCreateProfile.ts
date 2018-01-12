import { document } from 'firebase-functions/lib/providers/firestore';

export const addIdOnCreateProfile = document('profiles/{userId}')
  .onCreate((event) => {
    const id = event.data.id;
    return event.data.ref.update({ _id: id })
  });

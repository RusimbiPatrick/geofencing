import emailjs from 'emailjs-com';

const SERVICE_ID = 'your_service_id';
const TEMPLATE_ID = 'your_template_id';
const USER_ID = 'your_user_id';

export const sendEmail = async (event, latitude, longitude) => {
  const timestamp = new Date().toLocaleString();

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        event_type: event,
        lat: latitude,
        lng: longitude,
        time: timestamp,
      },
      USER_ID,
    );
    console.log(`${event} email sent`);
  } catch (error) {
    console.error('Email failed:', error);
  }
};

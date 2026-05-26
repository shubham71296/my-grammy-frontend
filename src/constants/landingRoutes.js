export const LANDING_ROUTES = {
  user: {
    instruments: "/user/instruments",
    courses: "/user/courses",
    instrumentDetail: (id) => `/user/instrument/${id}`,
    courseDetail: (id) => `/user/courses/${id}`,
  },
  guest: {
    instruments: "/guest/guestinstruments",
    courses: "/guest/guestcourses",
    instrumentDetail: (id) => `/guest/guestinstrument/${id}`,
    courseDetail: (id) => `/guest/guestcourse/${id}`,
  },
};

export const SITE = {
  website: "https://blog.torus.network//",
  author: "Torus",
  profile: "https://torus.network/",
  desc: "The thermodynamic god's favorite blog.",
  title: "Torus Blog",
  ogImage: "og-image.jpg",
  lightAndDarkMode: false,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/renlabs-dev/torus-blog/edit/main/",
  },
  dynamicOgImage: true,
} as const;

import uuid from 'uuid/v1';
import faker from 'faker';

/* eslint-disable global-require */
const Lists = [
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Backstreet',
    thumbnail: require('../images/home_demo_gif_2.gif'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.31',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',
      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',
      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',
      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',
      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',
      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',
      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',
      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_3.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: '1.0.1',
    update: '2019.01.02',
    create: '2018.12.15',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_gif_1.gif'),
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    favour: Math.floor(Math.random() * 10000000),
    version: '2.0.0',
    update: '2018.12.15',
    create: '2018.11.25',
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',
      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_2.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: '1.1.0',
    update: '2018.12.05',
    create: '2018.11.15',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Backstreet',
    thumbnail: require('../images/home_demo_5.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.20',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_4.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: '1.1.0',
    update: '2019.01.01',
    create: '2018.12.10',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_gif_2.gif'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.12',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_2.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2018.12.14',
    create: '2018.12.02',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_2.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.11',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Backstreet',
    thumbnail: require('../images/home_demo_gif_1.gif'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.02',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_gif_2.gif'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.16',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_5.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.28',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Arboreal',
    thumbnail: require('../images/home_demo_gif_2.gif'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.17',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Backstreet',
    thumbnail: require('../images/home_demo_2.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.01.01',
    create: '2018.12.29',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    screenshots: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
  {
    id: uuid(),
    title: faker.fake('{{name.lastName}}') + ' Hideout #' + faker.random.number(),
    author: faker.fake('{{name.firstName}}'),
    type: 'Backstreet',
    thumbnail: require('../images/home_demo_5.jpg'),
    favour: Math.floor(Math.random() * 10000000),
    version: 1,
    update: '2019.12.29',
    create: '2018.12.15',
    download: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 3000),
    favorite: Math.floor(Math.random() * 300),
    Ｆ: [
      {
        url: 'home_demo_gif_1.gif',
        type: 'image',

      },
      {
        url: 'home_demo_gif_2.gif',
        type: 'image',

      },
      {
        url: 'https://www.youtube.com/embed/V3QVyJAN3yM?rel=0',
        type: 'youtube',

      },
      {
        url: 'https://www.youtube.com/embed/DDx1fysX5oo?rel=0',
        type: 'youtube',

      },
      {
        url: 'home_demo_2.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_3.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_4.jpg',
        type: 'image',

      },
      {
        url: 'home_demo_5.jpg',
        type: 'image',

      },
    ],
  },
];

const Type = [
  {
    label: 'Arboreal',
    value: 'Arboreal',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/HighGardensHideout.png?scale=1',
  },
  {
    label: 'Backstreet',
    value: 'Backstreet',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/BackstreetHideout.png?scale=1',
  },
  {
    label: 'Baleful',
    value: 'Baleful',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/BalefulHideout.png?scale=1',
  },
  {
    label: 'Battle-scarred',
    value: 'Battle-scarred',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/BattlescarredHideout.png?scale=1',
  },
  {
    label: 'Brutal',
    value: 'Brutal',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/PrisonTowerHideout.png?scale=1',
  },
  {
    label: `Cartographer's`,
    value: `Cartographer's`,
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/CartographyHideout.png?scale=1',
  },
  {
    label: 'Coastal',
    value: 'Coastal',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/CoastalHideout.png?scale=1',
  },
  {
    label: 'Coral',
    value: 'Coral',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/CoralHideout.png?scale=1',
  },
  {
    label: 'Desert',
    value: 'Desert',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/DesertHideout.png?scale=1',
  },
  {
    label: 'Enlightened',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/EnlightenedHideout.png?scale=1',
    value: 'Enlightened',
  },
  {
    label: 'Excavated',
    value: 'Excavated',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/ExcavatedHideout.png?scale=1',
  },
  {
    label: 'Glacial',
    value: 'Glacial',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/IcebergHideout.png?scale=1',
  },
  {
    label: 'Immaculate',
    value: 'Immaculate',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/ImmaculateHideout.png?scale=1',
  },
  {
    label: 'Lush',
    value: 'Lush',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/LushHideout.png?scale=1',
  },
  {
    label: 'Luxurious',
    value: 'Luxurious',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/LuxuriousHideout.png?scale=1',
  },
  {
    label: 'Overgrown',
    value: 'Overgrown',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/OvergrownHideout.png?scale=1',
  },
  {
    label: `Robber's Trench`,
    value: `Robber's Trench`,
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/TrenchHideout.png?scale=1',
  },
  {
    label: 'Skeletal',
    value: 'Skeletal',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/SkeletalHideout.png?scale=1',
  },
  {
    label: 'Stately',
    value: 'Stately',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/StatelyHideout.png?scale=1',
  },

  {
    label: 'Sunken',
    value: 'Sunken',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/SunkenCityHideout.png?scale=1',
  },
  {
    label: 'Undercity',
    value: 'Undercity',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/UndercityHideout.png?scale=1',
  },
  {
    label: 'Unearthed',
    value: 'Unearthed',
    img: 'https://web.poecdn.com/image/Art/2DArt/UIImages/InGame/Hideout/HideoutImages/UnearthedHideout.png?scale=1',
  },
];

export const Hideout = {
  Lists,
  Type,
};

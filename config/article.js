export default (environment = 'development') => ({ // eslint-disable-line

  // link file UUID
  id: 'f4e8dfa4-a721-11e7-ab55-27219df83c97',

  // canonical URL of the published page
  //  get filled in by the ./configure script
  url: '',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-10-26T05:00:00Z'),

  headline: 'Confucius Institutes: cultural asset or campus threat?',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'China’s foothold in overseas universities is prompting fears over academic independence',

  topic: {
    name: 'China Politics & Policy',
    url: 'https://www.ft.com/topics/themes/China_Politics_&_Policy',
  },

  // relatedArticle: {
  //   text: 'Related article »',
  //   url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  // },

  mainImage: {
    title: 'Confucius Institutes: cultural asset or campus threat?',
    description: 'China’s foothold in overseas universities is prompting fears over academic independence',
    credit: '',

    // You can provide a UUID to an image and it was populate everything else
    // uuid: 'c4bf0be4-7c15-11e4-a7b8-00144feabdc0',
    uuid: 'f254e75e-b867-11e7-8c12-5661783e5589',

    // You can also provide a URL
    // url: 'https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fc4bf0be4-7c15-11e4-a7b8-00144feabdc0?source=ig&fit=scale-down&width=700',
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Jane Pong', url: 'https://www.ft.com/jane-pong' },
    { name: 'Emily Feng', url: 'https://www.ft.com/stream/3b7aef75-5d4f-3873-b156-8644e8eab910' },
  ],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialDescription: '',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  tweetText: 'Confucius Institutes: cultural asset or campus threat?',
  //
  // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)
  // twitterRelatedAccounts: ['authors_account_here', 'ftdata'],

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});

// You can look for "data-concept-id" on any stream page to find its UUID,
// and then prefix this with 'thing/' to use it below.
//
// EXAMPLES:
//
// Graphics (Methode list): 'list/graphics'
// World: 'thing/d8009323-f898-3207-b543-eab4427b7a77'
// UK: 'thing/98815f9a-0c35-3824-98fb-f134965f56b7'

export default (environment = 'development') => ({ // eslint-disable-line
  relatedContent: [
    { rows: 2, list: 'thing/2cca9e2a-2248-3e48-abc1-93d718b91bbe' },
  ],
});

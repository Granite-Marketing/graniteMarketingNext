// The GROQ projection that produces a `LinkValue` for resolve-link.ts.
//
// This exists because there were four hand-rolled copies of it — one in
// siteSettings.ts, one in queries.ts, and three more inlined in the
// `LIVE_QUERY` strings of components/blocks/{hero,capabilities,cta}-block.tsx
// (the Presentation live-preview path). When `isHomePage` was added to fix
// homepage links resolving to "/home", the first two were updated and the
// block copies were not, which would have shown "/home#services" while
// editing and "/#services" in production — a divergence visible only inside
// the Studio, which is the worst place for one.
//
// Only the live-preview copies consume this constant. queries.ts and
// siteSettings.ts deliberately keep their own inline copies: both are read
// by `sanity typegen`, which can only statically analyse literals and
// same-file constants. An imported constant is neither, and typegen fails by
// silently emitting ZERO queries for the whole file rather than erroring
// (see queries.ts's PAGE_TYPE_CHROME_FIELDS comment for the full account of
// that failure mode). __tests__/link-projection.test.ts pins all copies
// together instead, so the duplication cannot drift unnoticed.
export const LIVE_LINK_PROJECTION = `{
      linkType,
      internalRef->{
        _type,
        _id,
        slug,
        "isHomePage": _id == *[_id == "siteSettings"][0].homePage._ref
      },
      anchorPage->{
        _type,
        _id,
        slug,
        "isHomePage": _id == *[_id == "siteSettings"][0].homePage._ref
      },
      anchorId,
      href,
      openInNewTab,
      calLink
    }`;

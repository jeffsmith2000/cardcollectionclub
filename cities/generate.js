const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync('/Users/jeffsmith/.openclaw/workspace/card-business/directory/shops-database-v2.json', 'utf8'));
const shops = db.shops;

// City configs with shop matching logic
const cities = [
  {
    slug: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    intro: `Sydney's trading card scene is one of the most vibrant in the Southern Hemisphere, with dedicated shops scattered across the CBD, inner west, and the booming western corridor around Parramatta. Whether you're hunting for the latest Pokemon Scarlet &amp; Violet sets, chasing One Piece TCG romance dawn singles, or looking for competitive Yu-Gi-Oh and Magic: The Gathering events, Sydney has you covered. The city's card culture benefits from a passionate community that regularly hosts tournaments, pre-release events, and casual meetups. The CBD is home to flagship stores like Good Games on Park Street and the iconic Hobbyco in the Queen Victoria Building, while Parramatta's Westfield houses Ace Cards &amp; Collectibles — a must-visit for Japanese TCG fans. Sydney's proximity to Japan means many stores stock Japanese-language products alongside English releases, giving collectors access to exclusive artwork and early set releases. From big-box retailers stocking Pokemon booster packs to specialist shops offering graded vintage cards, Sydney's card shop ecosystem caters to every budget and interest. The city also hosts several major TCG events throughout the year, drawing players from across New South Wales and beyond.`,
    match: s => (s.city === 'Sydney' || s.state === 'NSW' || (s.city === 'Parramatta')) && !['Wollongong','Newcastle'].includes(s.city),
  },
  {
    slug: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    intro: `Melbourne is arguably Australia's trading card capital, boasting the highest concentration of dedicated TCG stores in the country. The CBD's Lonsdale Street corridor alone is home to Cherry Collectables, Good Games Melbourne, and Games Laboratory — all within walking distance of each other. This density creates a competitive marketplace that benefits collectors with better prices and more frequent events. Melbourne's card scene extends well beyond the city centre, with stores like Next Level Games serving the southeastern suburbs from Dandenong and Ringwood, while Good Games Epping caters to the northern corridor. The city's multicultural population drives strong demand for Japanese TCG products, particularly One Piece and Dragon Ball Super cards. Melbourne hosts some of Australia's largest Pokemon TCG Regional Championships and Magic: The Gathering Grand Prix events, attracting players from interstate and overseas. The city's coffee culture has even blended with the card scene — some stores now offer café-style experiences where you can crack packs over a flat white. For online shoppers, many of Australia's biggest TCG e-commerce operations are Melbourne-based, including Ozzie Collectables and TCGCards24, offering fast local shipping. Whether you're a competitive grinder or a casual collector, Melbourne's card scene has something for everyone.`,
    match: s => (s.city === 'Melbourne' || s.state === 'VIC') && !['Geelong','Ballarat'].includes(s.city),
  },
  {
    slug: 'brisbane',
    name: 'Brisbane',
    country: 'Australia',
    intro: `Brisbane's trading card scene has experienced remarkable growth in recent years, fuelled by the city's expanding population and a passionate community of collectors and competitive players. The heart of Brisbane's TCG culture is Fortitude Valley, where Good Games Brisbane serves as a major hub for tournaments and community events. Just south of the river, Tactics on Adelaide Street is one of Queensland's oldest hobby gaming stores, stocking everything from Pokemon and One Piece to Warhammer and RPGs. Brisbane's card scene benefits from its proximity to the Gold Coast, creating a broader South East Queensland market that supports both physical stores and online retailers like Card Haus. The city's subtropical climate means outdoor markets and pop-up card events are popular year-round, particularly at weekend community markets around South Bank and West End. Brisbane's growing Japanese community has also boosted demand for Japanese-language TCG products, with several stores now importing directly from Japan. The Queensland capital hosts regular Pokemon League events, One Piece TCG tournaments, and pre-release weekends that draw players from as far as Cairns and Townsville. With new stores opening regularly and the existing ones expanding their offerings, Brisbane's card scene is on a clear upward trajectory that shows no signs of slowing down.`,
    match: s => (s.city === 'Brisbane' || (s.state === 'QLD' && ['Brisbane','Fortitude Valley','Gold Coast'].includes(s.city))),
  },
  {
    slug: 'perth',
    name: 'Perth',
    country: 'Australia',
    intro: `Perth may be geographically isolated from Australia's eastern cities, but its trading card community punches well above its weight. The city's CBD is home to long-standing institutions like Quality Comics on Hay Street, which has been serving collectors for decades, and Spellbound Games on Barrack Street, known for its competitive MTG and Pokemon tournament scene. Perth's card culture has a tight-knit, community-driven feel that larger cities sometimes lack — regulars know each other by name, and new players are warmly welcomed. The Good Games franchise has a strong presence in greater Perth, with locations in Cannington and Rockingham serving the southern suburbs. Online retailers like TFC (Trading Card Fanatic) and GoodDeal Games operate out of Perth, giving locals the advantage of same-city shipping speeds. Perth's isolation actually works in its favour for some collectors, as the smaller market means less competition for limited releases and pre-orders. The city hosts regular Pokemon League events, One Piece TCG meetups, and weekly Magic tournaments across multiple venues. Western Australia's growing population and increasing interest in Japanese pop culture have driven steady growth in the TCG market, with new stores and online retailers emerging regularly. For visitors, Perth's card shops are mostly concentrated in the CBD and nearby suburbs, making them easy to visit in a single day trip.`,
    match: s => (s.state === 'WA'),
  },
  {
    slug: 'adelaide',
    name: 'Adelaide',
    country: 'Australia',
    intro: `Adelaide's trading card scene is a hidden gem that consistently surprises visitors with its depth and passion. The city's main card shopping strip is Hindley Street, where GUF (Games, Used &amp; Fun) and Reload Games sit within easy walking distance of each other, creating a mini card-shop corridor in the heart of the CBD. Good Games Adelaide on Peel Street adds another dedicated TCG venue to the mix, hosting weekly tournaments for Pokemon, Magic: The Gathering, and Yu-Gi-Oh. Further out, Tin Soldier on Prospect Road serves Adelaide's northern suburbs with a mix of TCGs, Warhammer, and board games. Adelaide's card community benefits from the city's compact size — most stores are within 15 minutes of each other, making it easy to shop around for the best prices and selection on any given day. The South Australian capital has a particularly strong retro gaming and trading card crossover culture, with stores like GUF and Reload blending vintage video games with modern TCG products. Adelaide hosts regular pre-release events and league play, and the community's smaller size means tournament scenes feel more personal and welcoming. The city's lower cost of living compared to Sydney and Melbourne also means some stores can offer more competitive pricing. For collectors of Pokemon, One Piece, and Japanese TCGs, Adelaide's stores maintain solid stock levels despite the smaller market size.`,
    match: s => (s.state === 'SA'),
  },
  {
    slug: 'auckland',
    name: 'Auckland',
    country: 'New Zealand',
    intro: `Auckland is the undisputed hub of New Zealand's trading card scene, home to the country's largest TCG retail chain and a thriving community of collectors and competitive players. Card Merchant dominates the Auckland landscape with multiple locations across the city — from their flagship West City store in Henderson to branches in Ponsonby and Takapuna on the North Shore. This coverage means most Aucklanders have a dedicated card shop within a short drive. Beyond Card Merchant, the city boasts Hobby Master in Penrose (a massive hobby superstore), Vagabond on Queen Street in the CBD, and King of Cards for online TCG purchases. Auckland's diverse population drives demand for a wide range of TCG products, with Japanese-language Pokemon and One Piece cards being particularly popular among the city's large Asian community. The city hosts New Zealand's most competitive Pokemon and MTG tournament circuits, with events drawing players from across the North Island. Mighty Ape, New Zealand's largest online entertainment retailer, is also Auckland-based, offering extensive TCG product lines with reliable nationwide delivery. Auckland's card scene benefits from direct shipping routes from Japan, meaning new Japanese TCG releases often arrive faster here than in many other Western markets. Whether you're looking for the latest English Pokemon set, Japanese One Piece booster boxes, or competitive MTG singles, Auckland has the infrastructure and community to support every type of card enthusiast.`,
    match: s => (s.countryCode === 'NZ' && (s.city === 'Auckland' || s.state === 'Auckland')),
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles',
    country: 'United States',
    intro: `Los Angeles is one of the world's great trading card cities, combining a massive collector base with proximity to some of the industry's biggest events and cultural influences. The greater LA area is home to iconic venues like Frank &amp; Son Collectible Show in City of Industry — a sprawling marketplace that runs twice weekly and features dozens of TCG vendors selling everything from bulk commons to PSA 10 graded vintage Pokemon cards. CoreTCG in nearby Pasadena is Southern California's premier tournament destination, hosting massive Yu-Gi-Oh, Pokemon, and One Piece events that attract players from across the western United States. LA's entertainment industry connections mean the city often gets exclusive promotional events and early access to new products. The city's diverse population creates strong demand for Japanese TCG products, with Little Tokyo and the San Gabriel Valley offering access to imported Japanese Pokemon and One Piece cards. LA's card collecting culture intersects with its celebrity and influencer scene — several prominent Pokemon and TCG content creators are based here, adding buzz to the local market. Big-box retailers like Target and Walmart maintain well-stocked TCG sections across hundreds of LA-area locations, while specialty online retailers ship nationwide from local warehouses. Whether you're a serious competitive player, a nostalgic collector, or just getting into the hobby, Los Angeles offers an unmatched depth and variety of trading card shopping experiences.`,
    match: s => (s.countryCode === 'US' && (s.state === 'CA' || s.city === 'City of Industry' || s.city === 'Pasadena')),
  },
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
    intro: `New York City's trading card scene is as diverse and dynamic as the city itself, offering everything from high-end graded card dealers to cozy neighborhood game shops where you can battle over a slice of pizza. Manhattan's Greenwich Village is home to The Uncommons, NYC's premier board game café that also hosts regular TCG events in a vibrant social setting. Brooklyn's Smoke and Mirrors Hobby Shop has become a community anchor for competitive Pokemon and One Piece players. Just north of the city, ToyWiz in Nanuet operates one of the longest-running TCG retail operations in the region, with both a physical store and a massive online presence. The greater New York area, including northern New Jersey, adds stores like Card Titan in Piscataway and Top Deck Hero in Westmont to the accessible shopping radius. NYC's position as a global cultural capital means the city hosts major TCG events, including Pokemon Regional Championships and Yu-Gi-Oh YCS tournaments at venues like the Javits Center. The city's Chinatown and Japanese cultural enclaves provide access to imported Asian TCG products that can be hard to find elsewhere. Dave &amp; Adam's Card World, based in upstate New York, is one of the nation's largest card retailers and ships to NYC-area customers with next-day delivery. For collectors, NYC's auction houses and high-end dealers offer access to the rarest vintage Pokemon and MTG cards on the market. The sheer density of the city means there's always a card shop, tournament, or meetup within subway distance.`,
    match: s => (s.countryCode === 'US' && (s.state === 'NY' || s.state === 'NJ' || s.city === 'New York' || s.city === 'Brooklyn')),
  },
  {
    slug: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    intro: `Toronto is Canada's trading card capital, home to some of the country's most legendary game stores and a fiercely competitive TCG community. The city's Yonge Street corridor is ground zero for card shopping, with 401 Games Downtown and Hairy Tarantula sitting within blocks of each other — both institutions that have shaped Canadian TCG culture for years. 401 Games is widely regarded as one of the best game stores in North America, with an inventory that rivals much larger operations and daily community events that keep the store buzzing. Face to Face Games, Canada's largest MTG retailer, has its Toronto flagship here, running the prestigious F2F Tour circuit that draws competitive players from across the country. The Greater Toronto Area extends the shopping options further, with 401 Games Vaughan serving the northern suburbs, J&amp;J Cards in Mississauga specialising in Pokemon and One Piece, and Everything Games in nearby Hamilton offering a comprehensive TCG selection. Toronto's multicultural population drives strong demand for Japanese TCG products, with stores importing directly from Japan to meet collector demand. The city hosts major Pokemon Regional Championships, MTG Regional Championship Qualifiers, and One Piece TCG events throughout the year. Toronto's card scene benefits from Canada's favourable exchange rate for imported products and a growing community of content creators who spotlight local stores and events. Whether you're on Bay Street during lunch or exploring the suburbs on a weekend, quality card shops are never far away in the GTA.`,
    match: s => (s.countryCode === 'CA' && (s.city === 'Toronto' || s.state === 'ON' || s.city === 'Vaughan' || s.city === 'Mississauga' || s.city === 'Hamilton')),
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    intro: `London's trading card scene combines centuries of collecting heritage with a modern, thriving TCG community that's growing faster than ever. The city's undisputed card gaming hub is Dark Sphere in Lambeth, London's largest independent game store, which boasts an enormous tournament space and stocks everything from Pokemon and One Piece to Magic: The Gathering and Warhammer. Forbidden Planet on Shaftesbury Avenue is another iconic destination — while primarily known for sci-fi and comics, their TCG section has expanded significantly to meet surging demand for Pokemon and Japanese card games. For online shopping, London-based Magic Madhouse is one of the UK's largest TCG retailers, offering next-day delivery across the capital and a massive selection of sealed products and singles. The broader UK market includes powerhouses like Total Cards (Birmingham), Chaos Cards (Colchester), and Big Orbit Cards (Walsall), all of which ship to London with fast delivery times. London's card scene benefits from the city's role as a hub for European TCG events, with major tournaments regularly hosted at ExCeL London and Olympia. The city's vast international community creates demand for products from every TCG market — Japanese, Korean, and European-exclusive cards are all findable if you know where to look. London's card trading culture also thrives at weekend markets, pop-up events, and through active Facebook and Discord communities that facilitate trades across the city's 32 boroughs. For competitive players, London offers weekly tournaments in virtually every TCG format, making it one of Europe's most active competitive scenes.`,
    match: s => (s.countryCode === 'GB'),
  },
];

const allCitySlugs = cities.map(c => c.slug);

function getShopsForCity(city) {
  const matched = shops.filter(city.match);
  // Deduplicate by id
  const seen = new Set();
  return matched.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function shopSchema(shop) {
  const obj = {
    "@type": "LocalBusiness",
    "name": shop.name,
    "description": shop.description,
    "url": shop.website
  };
  if (shop.address) obj.address = shop.address;
  if (shop.hours) obj.openingHours = shop.hours;
  return obj;
}

function generatePage(city) {
  const cityShops = getShopsForCity(city);
  const physicalShops = cityShops.filter(s => s.physical);
  const onlineShops = cityShops.filter(s => !s.physical);
  
  const relatedCities = cities.filter(c => c.slug !== city.slug);
  
  const schemaItems = cityShops.slice(0, 20).map(shopSchema);
  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Best Card Shops in ${city.name}`,
    "description": `Directory of the best Pokemon, One Piece, and trading card shops in ${city.name}`,
    "numberOfItems": cityShops.length,
    "itemListElement": schemaItems.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": item
    }))
  }, null, 2);

  function shopCard(shop) {
    const specialties = (shop.specialties || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('');
    const services = (shop.services || []).map(s => `<span class="service-tag">${escapeHtml(s)}</span>`).join('');
    const links = [];
    if (shop.website) links.push(`<a href="${escapeHtml(shop.website)}" target="_blank" rel="noopener" class="shop-link">🌐 Website</a>`);
    if (shop.googleMaps) links.push(`<a href="${escapeHtml(shop.googleMaps)}" target="_blank" rel="noopener" class="shop-link">📍 Google Maps</a>`);
    if (shop.instagram) links.push(`<a href="https://instagram.com/${shop.instagram.replace('@','')}" target="_blank" rel="noopener" class="shop-link">📸 ${escapeHtml(shop.instagram)}</a>`);
    
    return `
      <div class="shop-card">
        <div class="shop-header">
          <img src="${escapeHtml(shop.logoUrl)}" alt="${escapeHtml(shop.name)} logo" class="shop-logo" loading="lazy" onerror="this.style.display='none'">
          <div>
            <h3>${escapeHtml(shop.name)}</h3>
            ${shop.address ? `<p class="shop-address">📍 ${escapeHtml(shop.address)}</p>` : ''}
            ${shop.hours ? `<p class="shop-hours">🕐 ${escapeHtml(shop.hours)}</p>` : ''}
          </div>
        </div>
        <p class="shop-desc">${escapeHtml(shop.description)}</p>
        <div class="shop-tags">${specialties}</div>
        <div class="shop-services">${services}</div>
        <div class="shop-links">${links.join('')}</div>
      </div>`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Best Pokemon &amp; One Piece Card Shops in ${escapeHtml(city.name)} (2026) | Card Collection Club</title>
  <meta name="description" content="Find the best card shops in ${city.name}. Browse ${cityShops.length}+ stores for Pokemon cards, One Piece TCG, Yu-Gi-Oh, and MTG. Updated for 2026 with addresses, hours, and reviews.">
  <meta name="keywords" content="${city.name.toLowerCase()} card shops, pokemon cards ${city.name.toLowerCase()}, one piece tcg ${city.name.toLowerCase()}, trading card shops ${city.name.toLowerCase()}, mtg ${city.name.toLowerCase()}, yu-gi-oh ${city.name.toLowerCase()}, card stores near me">
  <link rel="canonical" href="https://cardcollectionclub.com/cities/${city.slug}">
  <meta property="og:title" content="Best Pokemon &amp; One Piece Card Shops in ${escapeHtml(city.name)} (2026)">
  <meta property="og:description" content="Find the best card shops in ${city.name}. ${cityShops.length}+ stores for Pokemon, One Piece, MTG &amp; more.">
  <meta property="og:url" content="https://cardcollectionclub.com/cities/${city.slug}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://cardcollectionclub.com/images/og-${city.slug}.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${schemaJson}
  </script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:#0a0a0a;color:#e0e0e0;line-height:1.7}
    a{color:#D4A853;text-decoration:none}
    a:hover{color:#f0c96e;text-decoration:underline}
    .container{max-width:900px;margin:0 auto;padding:0 20px}
    header{background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);border-bottom:2px solid #D4A853;padding:20px 0}
    .header-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    .logo{font-size:1.4rem;font-weight:800;color:#D4A853}
    nav a{margin-left:20px;font-size:.9rem;color:#ccc}
    nav a:hover{color:#D4A853}
    .hero{padding:60px 0 40px;text-align:center}
    .hero h1{font-size:2.4rem;font-weight:800;color:#fff;margin-bottom:10px}
    .hero .subtitle{color:#D4A853;font-size:1.1rem;margin-bottom:20px}
    .hero .count{background:#1a1a2e;display:inline-block;padding:8px 20px;border-radius:30px;font-size:.9rem;border:1px solid #333}
    .intro{padding:0 0 40px;font-size:1rem;color:#bbb;max-width:800px;margin:0 auto;text-align:left}
    .section-title{font-size:1.6rem;font-weight:700;color:#fff;margin:40px 0 20px;padding-bottom:10px;border-bottom:2px solid #D4A853}
    .shop-card{background:#111;border:1px solid #222;border-radius:12px;padding:24px;margin-bottom:20px;transition:border-color .2s}
    .shop-card:hover{border-color:#D4A853}
    .shop-header{display:flex;gap:16px;align-items:flex-start;margin-bottom:12px}
    .shop-logo{width:48px;height:48px;border-radius:8px;flex-shrink:0;background:#222}
    .shop-card h3{font-size:1.2rem;color:#fff;margin-bottom:4px}
    .shop-address,.shop-hours{font-size:.85rem;color:#999;margin-bottom:2px}
    .shop-desc{font-size:.95rem;color:#bbb;margin-bottom:12px}
    .shop-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
    .tag{background:#1a1a2e;color:#D4A853;padding:4px 10px;border-radius:20px;font-size:.75rem;border:1px solid #333}
    .shop-services{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
    .service-tag{background:#0d2818;color:#4ade80;padding:4px 10px;border-radius:20px;font-size:.75rem;border:1px solid #1a4d2e}
    .shop-links{display:flex;flex-wrap:wrap;gap:12px}
    .shop-link{font-size:.85rem;color:#D4A853}
    .cta-section{text-align:center;padding:50px 0;margin:40px 0;background:linear-gradient(135deg,#1a1a2e,#0a0a0a);border-radius:16px;border:1px solid #333}
    .cta-section h2{font-size:1.5rem;color:#fff;margin-bottom:10px}
    .cta-section p{color:#999;margin-bottom:20px;font-size:.95rem}
    .btn{display:inline-block;padding:12px 28px;border-radius:8px;font-weight:600;font-size:.95rem;transition:all .2s}
    .btn-gold{background:#D4A853;color:#0a0a0a}.btn-gold:hover{background:#f0c96e;text-decoration:none}
    .btn-outline{border:2px solid #D4A853;color:#D4A853;margin-left:12px}.btn-outline:hover{background:#D4A853;color:#0a0a0a;text-decoration:none}
    .related-cities{padding:40px 0}
    .city-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
    .city-link{background:#111;border:1px solid #222;border-radius:8px;padding:16px;text-align:center;font-weight:600;color:#fff;transition:all .2s}
    .city-link:hover{border-color:#D4A853;text-decoration:none;background:#1a1a2e}
    .signup{background:#111;border:1px solid #333;border-radius:16px;padding:40px;text-align:center;margin:40px 0}
    .signup h2{color:#fff;margin-bottom:8px}
    .signup p{color:#999;margin-bottom:20px}
    .signup form{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
    .signup input[type=email]{padding:12px 16px;border-radius:8px;border:1px solid #333;background:#1a1a2e;color:#fff;font-size:.95rem;min-width:260px}
    .signup button{padding:12px 24px;border-radius:8px;background:#D4A853;color:#0a0a0a;font-weight:600;border:none;cursor:pointer;font-size:.95rem}
    footer{border-top:1px solid #222;padding:30px 0;margin-top:40px;text-align:center;font-size:.8rem;color:#666}
    footer a{color:#888}
    @media(max-width:600px){.hero h1{font-size:1.6rem}.shop-header{flex-direction:column}.signup form{flex-direction:column;align-items:center}}
  </style>
</head>
<body>
  <header>
    <div class="container header-inner">
      <a href="https://cardcollectionclub.com" class="logo">♠ Card Collection Club</a>
      <nav>
        <a href="https://cardcollectionclub.com/directory">Directory</a>
        <a href="https://cardcollectionclub.com/cities/">Cities</a>
        <a href="https://cardcollectionclub.com/submit">Submit Shop</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <h1>Best Card Shops in ${escapeHtml(city.name)}</h1>
      <p class="subtitle">Your complete guide to Pokemon, One Piece &amp; TCG stores in ${escapeHtml(city.name)}</p>
      <span class="count">🏪 ${cityShops.length} shops listed &bull; Updated February 2026</span>
    </section>

    <section class="intro">
      <p>${city.intro}</p>
    </section>

${physicalShops.length > 0 ? `
    <h2 class="section-title">🏬 Physical Card Shops in ${escapeHtml(city.name)}</h2>
${physicalShops.map(shopCard).join('')}
` : ''}

${onlineShops.length > 0 ? `
    <h2 class="section-title">🌐 Online Card Stores in ${escapeHtml(city.name)}</h2>
${onlineShops.map(shopCard).join('')}
` : ''}

    <section class="cta-section">
      <h2>Looking for more card shops?</h2>
      <p>Browse our complete directory of ${db.metadata.totalShops}+ card shops across Australia, NZ, US, UK &amp; more.</p>
      <a href="https://cardcollectionclub.com/directory" class="btn btn-gold">Find More Shops</a>
      <a href="https://cardcollectionclub.com/submit" class="btn btn-outline">Submit Your Shop</a>
    </section>

    <section class="related-cities">
      <h2 class="section-title">🗺️ Explore Card Shops in Other Cities</h2>
      <div class="city-grid">
${relatedCities.map(c => `        <a href="/cities/${c.slug}" class="city-link">${c.name}</a>`).join('\n')}
      </div>
    </section>

    <section class="signup">
      <h2>Never Miss a New Shop or Deal</h2>
      <p>Join thousands of collectors getting weekly updates on new stores, exclusive deals, and TCG news.</p>
      <form action="https://cardcollectionclub.com/subscribe" method="POST">
        <input type="email" name="email" placeholder="Enter your email" required>
        <button type="submit">Subscribe Free</button>
      </form>
    </section>
  </main>

  <footer>
    <div class="container">
      <p style="margin-bottom:8px"><a href="https://cardcollectionclub.com">Card Collection Club</a> &bull; <a href="https://cardcollectionclub.com/directory">Shop Directory</a> &bull; <a href="https://cardcollectionclub.com/cities/">City Guides</a></p>
      <p>© 2026 Card Collection Club. All rights reserved. Shop information is provided for reference and may change without notice. We recommend contacting shops directly to confirm hours and stock availability.</p>
      <p style="margin-top:8px">Card Collection Club is not affiliated with The Pokemon Company, Bandai, Konami, or Wizards of the Coast.</p>
    </div>
  </footer>
</body>
</html>`;

  return html;
}

// Generate all city pages
for (const city of cities) {
  const html = generatePage(city);
  const outPath = path.join(__dirname, `${city.slug}.html`);
  fs.writeFileSync(outPath, html);
  const shopCount = getShopsForCity(city).length;
  console.log(`✅ ${city.slug}.html — ${shopCount} shops`);
}

// Generate index page
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Find Card Shops by City — Pokemon &amp; One Piece TCG Store Directory | Card Collection Club</title>
  <meta name="description" content="Browse the best Pokemon, One Piece, and trading card shops by city. Find local card stores in Sydney, Melbourne, Auckland, Los Angeles, New York, Toronto, London, and more.">
  <link rel="canonical" href="https://cardcollectionclub.com/cities/">
  <meta property="og:title" content="Find Card Shops by City | Card Collection Club">
  <meta property="og:description" content="Browse the best trading card shops by city. ${db.metadata.totalShops}+ stores across 10 major cities worldwide.">
  <meta property="og:url" content="https://cardcollectionclub.com/cities/">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Find Card Shops by City",
  "description": "Directory of trading card shops organized by city",
  "url": "https://cardcollectionclub.com/cities/",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
${cities.map((c, i) => `      {"@type":"ListItem","position":${i+1},"url":"https://cardcollectionclub.com/cities/${c.slug}","name":"Best Card Shops in ${c.name}"}`).join(',\n')}
    ]
  }
}
  </script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:#0a0a0a;color:#e0e0e0;line-height:1.7}
    a{color:#D4A853;text-decoration:none}a:hover{color:#f0c96e;text-decoration:underline}
    .container{max-width:900px;margin:0 auto;padding:0 20px}
    header{background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);border-bottom:2px solid #D4A853;padding:20px 0}
    .header-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    .logo{font-size:1.4rem;font-weight:800;color:#D4A853}
    nav a{margin-left:20px;font-size:.9rem;color:#ccc}nav a:hover{color:#D4A853}
    .hero{padding:60px 0 40px;text-align:center}
    .hero h1{font-size:2.4rem;font-weight:800;color:#fff;margin-bottom:10px}
    .hero p{color:#999;font-size:1.1rem;max-width:600px;margin:0 auto 20px}
    .cities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;padding:40px 0}
    .city-card{background:#111;border:1px solid #222;border-radius:16px;padding:30px;text-align:center;transition:all .3s}
    .city-card:hover{border-color:#D4A853;transform:translateY(-4px);text-decoration:none}
    .city-card h2{font-size:1.3rem;color:#fff;margin-bottom:6px}
    .city-card .country{color:#D4A853;font-size:.85rem;margin-bottom:8px}
    .city-card .shop-count{color:#999;font-size:.9rem}
    .city-card .flag{font-size:2rem;margin-bottom:10px;display:block}
    .cta{text-align:center;padding:50px 0;margin:20px 0;background:linear-gradient(135deg,#1a1a2e,#0a0a0a);border-radius:16px;border:1px solid #333}
    .cta h2{color:#fff;margin-bottom:10px}.cta p{color:#999;margin-bottom:20px}
    .btn{display:inline-block;padding:12px 28px;border-radius:8px;font-weight:600;font-size:.95rem}
    .btn-gold{background:#D4A853;color:#0a0a0a}.btn-gold:hover{background:#f0c96e;text-decoration:none}
    .btn-outline{border:2px solid #D4A853;color:#D4A853;margin-left:12px}.btn-outline:hover{background:#D4A853;color:#0a0a0a;text-decoration:none}
    footer{border-top:1px solid #222;padding:30px 0;margin-top:40px;text-align:center;font-size:.8rem;color:#666}
    footer a{color:#888}
    @media(max-width:600px){.hero h1{font-size:1.6rem}}
  </style>
</head>
<body>
  <header>
    <div class="container header-inner">
      <a href="https://cardcollectionclub.com" class="logo">♠ Card Collection Club</a>
      <nav>
        <a href="https://cardcollectionclub.com/directory">Directory</a>
        <a href="https://cardcollectionclub.com/cities/">Cities</a>
        <a href="https://cardcollectionclub.com/submit">Submit Shop</a>
      </nav>
    </div>
  </header>
  <main class="container">
    <section class="hero">
      <h1>Find Card Shops by City</h1>
      <p>Browse the best Pokemon, One Piece, and trading card shops in major cities worldwide. ${db.metadata.totalShops}+ stores and counting.</p>
    </section>

    <div class="cities-grid">
${cities.map(c => {
  const count = getShopsForCity(c).length;
  const flags = {Sydney:'🇦🇺',Melbourne:'🇦🇺',Brisbane:'🇦🇺',Perth:'🇦🇺',Adelaide:'🇦🇺',Auckland:'🇳🇿','Los Angeles':'🇺🇸','New York':'🇺🇸',Toronto:'🇨🇦',London:'🇬🇧'};
  return `      <a href="/cities/${c.slug}" class="city-card">
        <span class="flag">${flags[c.name]}</span>
        <h2>Best Card Shops in ${c.name}</h2>
        <span class="country">${c.country}</span>
        <p class="shop-count">${count} shops listed</p>
      </a>`;
}).join('\n')}
    </div>

    <section class="cta">
      <h2>Don't see your city?</h2>
      <p>Browse our full directory or submit your local card shop to be listed.</p>
      <a href="https://cardcollectionclub.com/directory" class="btn btn-gold">Full Directory</a>
      <a href="https://cardcollectionclub.com/submit" class="btn btn-outline">Submit a Shop</a>
    </section>
  </main>
  <footer>
    <div class="container">
      <p style="margin-bottom:8px"><a href="https://cardcollectionclub.com">Card Collection Club</a> &bull; <a href="https://cardcollectionclub.com/directory">Shop Directory</a> &bull; <a href="https://cardcollectionclub.com/cities/">City Guides</a></p>
      <p>© 2026 Card Collection Club. All rights reserved. Shop information is provided for reference and may change without notice.</p>
      <p style="margin-top:8px">Card Collection Club is not affiliated with The Pokemon Company, Bandai, Konami, or Wizards of the Coast.</p>
    </div>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);
console.log('✅ index.html — hub page');
console.log('\nDone! All 11 pages generated.');

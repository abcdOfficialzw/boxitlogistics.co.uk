(function () {
  const site = {
    phoneDisplay: (window.CONFIG && window.CONFIG.DISPLAY_PHONE) || "07741 724209",
    phoneHref: `+${(window.CONFIG && window.CONFIG.CALL_PHONE) || "447741724209"}`,
    email: (window.CONFIG && window.CONFIG.EMAIL) || "nobert@boxitlogistics.co.uk",
  };

  const serviceLinks = [
    { id: "house-removals", label: "House Removals", href: "/house-removals-walsall/" },
    { id: "office-moves", label: "Office Moves", href: "/office-moves-walsall/" },
    { id: "storage", label: "Storage", href: "/storage-solutions-walsall/" },
    { id: "handyman", label: "Handyman & Interiors", href: "/handyman-media-walls-midlands/" },
  ];

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "services", label: "Services", type: "dropdown", children: serviceLinks },
    { id: "reviews", label: "Reviews", href: "/reviews/" },
    { id: "blog", label: "Blog", href: "/blog/" },
    { id: "faqs", label: "FAQs", href: "/faqs/" },
  ];

  const footerServiceLinks = [
    { label: "House Removals", href: "/house-removals-walsall/" },
    { label: "Office Moves", href: "/office-moves-walsall/" },
    { label: "Furniture Delivery", href: "/furniture-delivery-walsall/" },
    { label: "Furniture Assembly", href: "/furniture-assembly-dismantling-walsall/" },
    { label: "Storage Solutions", href: "/storage-solutions-walsall/" },
    { label: "Handyman & Media Walls", href: "/handyman-media-walls-midlands/" },
    { label: "Removals in Walsall", href: "/removals-walsall/" },
  ];

  const footerAreaLinks = [
    { label: "Removal Company Wolverhampton", href: "/removal-company-wolverhampton/" },
    { label: "Walsall to London Moves", href: "/house-removals-walsall-to-london/" },
    { label: "Reviews", href: "/reviews/" },
    { label: "Blog", href: "/blog/" },
    { label: "Privacy Policy", href: "/privacy-policy.html" },
    { label: "Terms of Service", href: "/terms-of-service.html" },
  ];

  function navLinkClasses(isActive) {
    return isActive
      ? "text-brand-orange"
      : "text-slate-600 hover:text-brand-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30";
  }

  function renderNav(activeId) {
    return navItems
      .map((item) => {
        if (item.type === "dropdown") {
          const groupActive = item.children.some((c) => c.id === activeId);
          const menu = item.children
            .map((c) => `<a href="${c.href}" class="block rounded-md px-3 py-2 text-sm ${c.id === activeId ? "text-brand-orange" : "text-slate-600 hover:bg-brand-cream hover:text-brand-orange"}">${c.label}</a>`)
            .join("");
          return `
            <div class="group relative">
              <button type="button" class="inline-flex items-center gap-1 ${navLinkClasses(groupActive)}" aria-haspopup="true">
                ${item.label}<i data-lucide="chevron-down" class="h-4 w-4 transition-transform group-hover:rotate-180"></i>
              </button>
              <div class="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div class="min-w-[210px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">${menu}</div>
              </div>
            </div>`;
        }
        return `<a href="${item.href}" class="${navLinkClasses(item.id === activeId)}">${item.label}</a>`;
      })
      .join("");
  }

  function renderMobileNav(activeId, quoteTarget) {
    return navItems
      .map((item) => {
        if (item.type === "dropdown") {
          const children = item.children
            .map((c) => `<a href="${c.href}" class="py-1.5 pl-3 ${c.id === activeId ? "text-brand-orange" : "text-slate-600 hover:text-slate-900"}">${c.label}</a>`)
            .join("");
          return `<span class="pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">${item.label}</span><div class="grid">${children}</div>`;
        }
        return `<a href="${item.href}" class="py-2 ${item.id === activeId ? "text-brand-orange" : "text-slate-700 hover:text-slate-900"}">${item.label}</a>`;
      })
      .join("") + `
      <a href="#contact-form" class="py-2 text-slate-700 hover:text-slate-900">Contact</a>
      <div class="flex gap-2 pt-2">
        <a href="tel:${site.phoneHref}" class="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <i data-lucide="phone" class="h-4 w-4 text-brand-orange"></i> Call
        </a>
        <a href="${quoteTarget}" class="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark">
          <i data-lucide="clipboard-check" class="h-4 w-4"></i> Quote
        </a>
      </div>
    `;
  }

  function renderHeader(node) {
    const activeId = node.dataset.active || "home";
    const quoteTarget = node.dataset.quoteTarget || "#contact-form";

    node.innerHTML = `
      <div class="w-full border-b border-slate-200 bg-slate-50/70">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between py-2 text-xs sm:text-sm text-slate-600">
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-1">
                <i data-lucide="shield-check" class="h-4 w-4 text-brand-orange"></i>
                Fully insured
              </span>
              <span class="hidden sm:inline-flex items-center gap-1">
                <i data-lucide="house" class="h-4 w-4 text-brand-orange"></i>
                Family-owned in Walsall Wood
              </span>
            </div>
            <div class="flex items-center gap-3">
              <span class="hidden md:inline-flex items-center gap-1">
                <i data-lucide="truck" class="h-4 w-4 text-brand-orange"></i>
                Local and nationwide moves
              </span>
              <a href="tel:${site.phoneHref}" class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-orange hover:bg-brand-cream hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30">
                <i data-lucide="phone" class="h-4 w-4 text-brand-orange"></i>
                ${site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>

      <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <a href="/" class="flex items-center gap-2" aria-label="Boxit Logistics">
              <img src="/assets/logo-mark.png" alt="Boxit Logistics logo" class="h-8 w-8 rounded-md object-contain">
              <div class="flex flex-col leading-none">
                <span style="font-family: 'Plus Jakarta Sans', Inter, ui-sans-serif; letter-spacing: -0.02em;" class="text-lg font-semibold tracking-tight text-slate-900">Boxit Logistics</span>
                <span class="text-[11px] font-medium text-slate-500 -mt-0.5">House and office removals in Walsall Wood</span>
              </div>
            </a>

            <nav class="hidden md:flex items-center gap-6 text-sm">
              ${renderNav(activeId)}
              <a href="#contact-form" class="text-slate-600 hover:text-brand-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30">Contact</a>
            </nav>

            <div class="hidden md:flex items-center gap-3">
              <a href="tel:${site.phoneHref}" class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-brand-orange hover:bg-brand-cream hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30">
                <i data-lucide="phone" class="h-4 w-4 text-brand-orange"></i>
                Call
              </a>
              <a href="${quoteTarget}" class="inline-flex items-center gap-2 rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30">
                <i data-lucide="clipboard-check" class="h-4 w-4"></i>
                Get a Quote
              </a>
            </div>

            <button class="md:hidden inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30" aria-label="Open Menu" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
              <i data-lucide="menu" class="h-5 w-5"></i>
            </button>
          </div>
        </div>
        <div id="mobile-menu" class="hidden border-t border-slate-200 bg-white md:hidden">
          <div class="mx-auto max-w-7xl px-4 py-3 text-sm">
            <div class="grid gap-2">
              ${renderMobileNav(activeId, quoteTarget)}
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function renderContactSection(node) {
    const heading = node.dataset.heading || "Ready to plan your move?";
    const copy =
      node.dataset.copy ||
      "Tell us what you need moved and we will come back with a free, no-obligation quote.";

    node.outerHTML = `
      <section id="contact-form" class="border-t border-slate-200 bg-slate-50/50">
        <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div class="grid gap-8 lg:grid-cols-3">
            <div class="lg:col-span-1">
              <p class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-orange">Free quote</p>
              <h2 style="font-family: 'Plus Jakarta Sans', Inter, ui-sans-serif; letter-spacing: -0.02em;" class="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">${heading}</h2>
              <p class="mt-3 text-slate-600">${copy}</p>
              <div class="mt-5 space-y-3 text-sm text-slate-600">
                <a href="tel:${site.phoneHref}" class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
                  <i data-lucide="phone" class="h-4 w-4 text-brand-orange"></i>${site.phoneDisplay}
                </a>
                <div class="flex flex-wrap gap-2">
                  <a href="sms:${site.phoneHref}" class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
                    <i data-lucide="message-circle" class="h-4 w-4 text-brand-orange"></i>Text us
                  </a>
                  <a href="mailto:${site.email}" class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
                    <i data-lucide="mail" class="h-4 w-4 text-brand-orange"></i>Email
                  </a>
                </div>
              </div>
              <div class="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <p class="font-semibold text-slate-900">What helps us quote quickly?</p>
                <ul class="mt-3 space-y-2">
                  <li class="flex gap-2"><i data-lucide="check" class="mt-0.5 h-4 w-4 text-brand-orange"></i>Collection and delivery postcodes</li>
                  <li class="flex gap-2"><i data-lucide="check" class="mt-0.5 h-4 w-4 text-brand-orange"></i>Property or office size</li>
                  <li class="flex gap-2"><i data-lucide="check" class="mt-0.5 h-4 w-4 text-brand-orange"></i>Large items, storage, or assembly needs</li>
                </ul>
              </div>
            </div>
            <div class="lg:col-span-2">
              <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <form class="lead-form grid grid-cols-1 gap-4 sm:grid-cols-2" data-form="Footer Contact">
                  <input type="hidden" name="source" value="Contact Section">
                  <div>
                    <label class="mb-1 block text-xs font-medium text-slate-600">Name</label>
                    <input name="name" type="text" required placeholder="Your full name" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20">
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-slate-600">Preferred contact</label>
                    <select name="contact_method" required class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20">
                      <option value="">Select</option>
                      <option>Phone</option>
                      <option>SMS / Text</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-slate-600">Phone</label>
                    <input name="phone" type="tel" required placeholder="e.g. ${site.phoneDisplay}" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20">
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-slate-600">Email</label>
                    <input name="email" type="email" required placeholder="${site.email}" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20">
                  </div>
                  <div class="sm:col-span-2">
                    <label class="mb-1 block text-xs font-medium text-slate-600">Message</label>
                    <textarea name="message" rows="4" placeholder="Move details: dates, addresses, floors, parking, special items, storage or assembly requirements..." class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"></textarea>
                  </div>
                  <div class="sm:col-span-2 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    <p class="text-xs text-slate-500">No obligation. We aim to respond quickly and clearly.</p>
                    <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30 sm:w-auto">
                      <i data-lucide="send" class="h-4 w-4"></i>
                      Enquire Now
                    </button>
                  </div>
                </form>
                <div class="mt-2 text-[11px] text-slate-500">Prefer to speak? Call us at ${site.phoneDisplay}.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter(node) {
    const services = footerServiceLinks
      .map((item) => `<li><a href="${item.href}" class="hover:text-slate-900">${item.label}</a></li>`)
      .join("");
    const areas = footerAreaLinks
      .map((item) => `<li><a href="${item.href}" class="hover:text-slate-900">${item.label}</a></li>`)
      .join("");

    node.innerHTML = `
      <footer class="border-t border-slate-200 bg-slate-50/70">
        <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div class="grid gap-8 text-sm md:grid-cols-4">
            <div class="md:col-span-2">
              <div class="flex items-center gap-2">
                <img src="/assets/logo-mark.png" alt="Boxit Logistics logo" class="h-8 w-8 rounded-md object-contain">
                <div class="flex flex-col leading-none">
                  <span style="font-family: 'Plus Jakarta Sans', Inter, ui-sans-serif; letter-spacing: -0.02em;" class="text-base font-semibold tracking-tight text-slate-900">Boxit Logistics</span>
                  <span class="text-[11px] font-medium text-slate-500 -mt-0.5">Removals, furniture transport, storage</span>
                </div>
              </div>
              <p class="mt-3 max-w-md text-slate-600">Trusted house removals, office moves, furniture delivery, dismantling and short-term storage across Walsall, the West Midlands, and long-distance UK routes.</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <a href="/removals-walsall/" class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand-orange hover:text-brand-orange">Walsall removals</a>
                <a href="/removal-company-wolverhampton/" class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand-orange hover:text-brand-orange">Wolverhampton moves</a>
                <a href="/house-removals-walsall-to-london/" class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand-orange hover:text-brand-orange">London relocations</a>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-900">Services</h4>
              <ul class="mt-3 space-y-2 text-slate-600">${services}</ul>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-900">Areas & Contact</h4>
              <ul class="mt-3 space-y-2 text-slate-600">${areas}</ul>
              <div class="mt-5 space-y-2 text-slate-600">
                <p><a href="tel:${site.phoneHref}" class="hover:text-slate-900">${site.phoneDisplay}</a></p>
                <p><a href="mailto:${site.email}" class="hover:text-slate-900">${site.email}</a></p>
                <p>Walsall Wood, West Midlands</p>
                <p>Mon-Sat: 08:00-18:00</p>
                <p>Sun: By appointment</p>
              </div>
              <p class="mt-4 text-xs text-slate-500">© <span id="year"></span> Boxit Logistics. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  function renderMobileBar(node) {
    const quoteTarget = node.dataset.quoteTarget || "#contact-form";

    node.innerHTML = `
      <div class="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div class="mx-auto max-w-7xl px-4 py-2">
          <div class="grid grid-cols-4 gap-2">
            <a href="tel:${site.phoneHref}" class="inline-flex flex-col items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-2 text-[11px] text-slate-600 hover:bg-slate-50">
              <i data-lucide="phone" class="h-4 w-4 text-brand-orange"></i>
              Call
            </a>
            <a href="sms:${site.phoneHref}" class="inline-flex flex-col items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-2 text-[11px] text-slate-600 hover:bg-slate-50">
              <i data-lucide="message-circle" class="h-4 w-4 text-brand-orange"></i>
              Text
            </a>
            <a href="mailto:${site.email}" class="inline-flex flex-col items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-2 text-[11px] text-slate-600 hover:bg-slate-50">
              <i data-lucide="mail" class="h-4 w-4 text-brand-orange"></i>
              Email
            </a>
            <a href="${quoteTarget}" class="inline-flex flex-col items-center justify-center rounded-md bg-brand-orange px-2 py-2 text-[11px] font-semibold text-white hover:bg-brand-orange-dark">
              <i data-lucide="clipboard-check" class="h-4 w-4"></i>
              Quote
            </a>
          </div>
        </div>
      </div>
    `;
  }

  document.querySelectorAll("[data-site-header]").forEach(renderHeader);
  document.querySelectorAll("[data-site-contact]").forEach(renderContactSection);
  document.querySelectorAll("[data-site-footer]").forEach(renderFooter);
  document.querySelectorAll("[data-site-mobile-bar]").forEach(renderMobileBar);
})();

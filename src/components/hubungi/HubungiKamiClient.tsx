"use client";

import ContactForm from "@/components/shared/ContactForm";

interface PlatformItem {
  platform: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  btnText: string;
}

interface SectionData {
  heading?: string;
  subTitle?: string;
  items?: PlatformItem[];
}

interface ContactData {
  heading?: string;
  subTitle?: string;
}

interface HubungiKamiClientProps {
  socialSection: SectionData;
  marketplaceSection: SectionData;
  contactSection: ContactData;
}

export default function HubungiKamiClient({
  socialSection,
  marketplaceSection,
  contactSection,
}: HubungiKamiClientProps) {
  const socialItems = socialSection.items || [];
  const marketplaceItems = marketplaceSection.items || [];

  return (
    <>
      {/* Social Media Section */}
      <section className="space bg-smoke2 overflow-hidden" id="service-sec">
        <div className="shape-mockup d-none d-xl-block" data-top="8%" data-left="6%">
          <div className="dna-ani">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="shape-mockup jump d-none d-xl-block" data-top="10%" data-right="10%">
          <img src="/assets/img/shape/kit_1.png" alt="shape" />
        </div>
        <div className="shape-mockup moving d-none d-xl-block" data-bottom="10%" data-left="6%">
          <img src="/assets/img/shape/kit_2.png" alt="shape" />
        </div>
        <div className="shape-mockup jump-reverse d-none d-xl-block" data-bottom="10%" data-right="4%">
          <img src="/assets/img/shape/kit_3.png" alt="shape" />
        </div>
        <div className="container th-container5">
          <div className="title-area text-center">
            <span className="sub-title text-anime-style-2">{socialSection.subTitle || "Platform Sosial Media Kami"}</span>
            <h2 className="sec-title text-anime-style-3">{socialSection.heading || "Temukan dan Ikuti Sea-Quill"}</h2>
          </div>
          <div className="gallery-divider"></div>
          <div className="nav service-block-tab" id="sosmed-block-tab" role="tablist">
            {socialItems.map((item, idx) => (
              <button
                key={idx}
                className={`tab-btn${idx === 0 ? " active" : ""}`}
                id={`nav-social-${idx}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#nav-social-${idx}`}
                type="button"
                role="tab"
                aria-controls={`nav-social-${idx}`}
                aria-selected={idx === 0}
              >
                <div className="box-icon">
                  <img src={item.icon} alt={item.platform} style={{ width: "38px" }} />
                </div>
                {item.platform}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {socialItems.map((item, idx) => (
              <div
                key={idx}
                className={`tab-pane fade${idx === 0 ? " show active" : ""}`}
                id={`nav-social-${idx}`}
                role="tabpanel"
                aria-labelledby={`nav-social-${idx}-tab`}
              >
                <div
                  className="service-block"
                  data-bg-src="/assets/img/bg/service_block_bg.png"
                  style={{ backgroundImage: "url(/assets/img/bg/service_block_bg.png)" }}
                >
                  <div className="box-content">
                    <h3 className="box-title">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h3>
                    <p className="box-text">{item.description}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="th-btn">
                      {item.btnText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="space bg-smoke2 overflow-hidden">
        <div className="shape-mockup d-none d-xl-block" data-top="8%" data-left="6%">
          <div className="dna-ani">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="shape-mockup jump d-none d-xl-block" data-top="10%" data-right="10%">
          <img src="/assets/img/shape/kit_1.png" alt="shape" />
        </div>
        <div className="shape-mockup moving d-none d-xl-block" data-bottom="10%" data-left="6%">
          <img src="/assets/img/shape/kit_2.png" alt="shape" />
        </div>
        <div className="shape-mockup jump-reverse d-none d-xl-block" data-bottom="10%" data-right="4%">
          <img src="/assets/img/shape/kit_3.png" alt="shape" />
        </div>
        <div className="container th-container5">
          <div className="title-area text-center">
            <span className="sub-title text-anime-style-2">{marketplaceSection.subTitle || "Marketplace Resmi Sea-Quill"}</span>
            <h2 className="sec-title text-anime-style-3">{marketplaceSection.heading || "Belanja Produk Sea-Quill di Sini"}</h2>
          </div>
          <div className="gallery-divider"></div>
          <div className="nav service-block-tab" id="market-block-tab" role="tablist">
            {marketplaceItems.map((item, idx) => (
              <button
                key={idx}
                className={`tab-btn${idx === 0 ? " active" : ""}`}
                id={`nav-market-${idx}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#nav-market-${idx}`}
                type="button"
                role="tab"
                aria-controls={`nav-market-${idx}`}
                aria-selected={idx === 0}
              >
                <div className="box-icon">
                  <img src={item.icon} alt={item.platform} style={{ width: "38px" }} />
                </div>
                {item.platform}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {marketplaceItems.map((item, idx) => (
              <div
                key={idx}
                className={`tab-pane fade${idx === 0 ? " show active" : ""}`}
                id={`nav-market-${idx}`}
                role="tabpanel"
                aria-labelledby={`nav-market-${idx}-tab`}
              >
                <div
                  className="service-block"
                  data-bg-src="/assets/img/bg/service_block_bg.png"
                  style={{ backgroundImage: "url(/assets/img/bg/service_block_bg.png)" }}
                >
                  <div className="box-content">
                    <h3 className="box-title">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h3>
                    <p className="box-text">{item.description}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="th-btn">
                      {item.btnText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="space overflow-hidden">
        <div className="container">
          <div className="title-area text-center">
            <span className="sub-title text-anime-style-2">{contactSection.subTitle || "Hubungi Kami"}</span>
            <h2 className="sec-title text-anime-style-3">{contactSection.heading || "Kirim Pesan kepada Kami"}</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";

interface FeatureCard {
  title: string;
  text: string;
  btnText: string;
  href: string;
}

const animations = ["fadeInLeft", "fadeInUp", "fadeInRight"];
const delays = [".2s", ".4s", ".6s"];

export default function FeatureCards({ features }: { features: FeatureCard[] }) {
  return (
    <div className="position-relative space">
      <div className="container">
        <div className="row gy-4 justify-content-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`col-md-6 col-xl-4 feature-card_wrapp wow ${animations[index] || "fadeInUp"}`}
              data-wow-delay={delays[index] || ".4s"}
            >
              <div className="feature-card th-ani">
                <h3 className="box-title text-anime-style-2">
                  {feature.title}
                </h3>
                <p className="box-text">{feature.text}</p>
                <Link href={feature.href} className="th-btn black-border">
                  {feature.btnText}{" "}
                  <i className="fa-regular fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  description,
  imageUrl,
}) => (
  <div className="bg-card rounded-lg p-6 text-center shadow-lg mx-2">
    <div className="relative w-32 h-32 mx-auto mb-4">
      <div className="rounded-full w-full h-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
        <span className="text-4xl font-bold text-primary">
          {name.split(" ")[0].charAt(0)}
        </span>
      </div>
    </div>
    <h3 className="text-xl font-semibold text-foreground">{name}</h3>
    <p className="text-sm text-muted-foreground mb-2">{role}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="flex justify-center space-x-4 mt-4">
      <button className="text-muted-foreground hover:text-primary">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
        </svg>
      </button>
      <button className="text-muted-foreground hover:text-primary">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
        </svg>
      </button>
      <button className="text-muted-foreground hover:text-primary">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.374 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.626-5.374-12-12-12z"></path>
        </svg>
      </button>
    </div>
  </div>
);

export function Team() {
  const teamMembers = [
    {
      name: "Shao-Hsiang Chien",
      role: "Team Member",
      description:
        "Software Developer with expertise in full-stack development.",
      imageUrl: "/team/shao-hsiang.jpg",
    },
    {
      name: "Hua-Yu Cheng",
      role: "Team Member",
      description: "Experienced in web development and system architecture.",
      imageUrl: "/team/hua-yu.jpg",
    },
    {
      name: "Cho-Yun Lei",
      role: "Team Member",
      description: "Specialized in frontend development and user experience.",
      imageUrl: "/team/cho-yun.jpg",
    },
    {
      name: "Ndidi Nwosu",
      role: "Team Member",
      description: "Expert in backend development and database management.",
      imageUrl: "/team/ndidi.jpg",
    },
    {
      name: "Boya Chang",
      role: "Team Member",
      description: "Focused on software testing and quality assurance.",
      imageUrl: "/team/boya.jpg",
    },
    {
      name: "Yucheng Yan",
      role: "Team Member",
      description: "Specialized in system integration and deployment.",
      imageUrl: "/team/yucheng.jpg",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="mt-20 py-20" id="team">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Meet Our Team</h2>
        <p className="mt-4 text-muted-foreground">
          The talented people behind ShortKing
        </p>
      </div>
      <div className="mt-16 max-w-6xl mx-auto px-4">
        <Slider {...settings}>
          {teamMembers.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </Slider>
      </div>
    </section>
  );
}

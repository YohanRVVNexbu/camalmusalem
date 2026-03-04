function SocialButton({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-11.5 items-center justify-center rounded-full bg-[#EAEAF1] shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition hover:bg-[#dddde5]"
        >
            {children}
        </a>
    );
}

function IconX() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
            <path d="M17.325 0H20.6989L13.3289 8.471L22 20H15.2114L9.89057 13.0091L3.80914 20H0.432143L8.31443 10.9363L0 0.00157627H6.96143L11.7637 6.39029L17.325 0ZM16.1386 17.9697H18.0086L5.94 1.92465H3.93486L16.1386 17.9697Z" fill="#231F20" />
        </svg>
    );
}

function IconFacebook() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" fill="#231F20" />
        </svg>
    );
}

function IconInstagram() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6.96 0H17.04C20.88 0 24 3.12 24 6.96V17.04C24 18.8859 23.2667 20.6562 21.9615 21.9615C20.6562 23.2667 18.8859 24 17.04 24H6.96C3.12 24 0 20.88 0 17.04V6.96C0 5.11409 0.733284 3.34379 2.03854 2.03854C3.34379 0.733284 5.11409 0 6.96 0ZM6.72 2.4C5.57427 2.4 4.47546 2.85514 3.6653 3.6653C2.85514 4.47546 2.4 5.57427 2.4 6.72V17.28C2.4 19.668 4.332 21.6 6.72 21.6H17.28C18.4257 21.6 19.5245 21.1449 20.3347 20.3347C21.1449 19.5245 21.6 18.4257 21.6 17.28V6.72C21.6 4.332 19.668 2.4 17.28 2.4H6.72ZM18.3 4.2C18.6978 4.2 19.0794 4.35804 19.3607 4.63934C19.642 4.92064 19.8 5.30218 19.8 5.7C19.8 6.09783 19.642 6.47936 19.3607 6.76066C19.0794 7.04197 18.6978 7.2 18.3 7.2C17.9022 7.2 17.5206 7.04197 17.2393 6.76066C16.958 6.47936 16.8 6.09783 16.8 5.7C16.8 5.30218 16.958 4.92064 17.2393 4.63934C17.5206 4.35804 17.9022 4.2 18.3 4.2ZM12 6C13.5913 6 15.1174 6.63214 16.2426 7.75736C17.3679 8.88258 18 10.4087 18 12C18 13.5913 17.3679 15.1174 16.2426 16.2426C15.1174 17.3679 13.5913 18 12 18C10.4087 18 8.88258 17.3679 7.75736 16.2426C6.63214 15.1174 6 13.5913 6 12C6 10.4087 6.63214 8.88258 7.75736 7.75736C8.88258 6.63214 10.4087 6 12 6ZM12 8.4C11.0452 8.4 10.1295 8.77929 9.45442 9.45442C8.77928 10.1296 8.4 11.0452 8.4 12C8.4 12.9548 8.77928 13.8705 9.45442 14.5456C10.1295 15.2207 11.0452 15.6 12 15.6C12.9548 15.6 13.8705 15.2207 14.5456 14.5456C15.2207 13.8705 15.6 12.9548 15.6 12C15.6 11.0452 15.2207 10.1296 14.5456 9.45442C13.8705 8.77929 12.9548 8.4 12 8.4Z" fill="#231F20" />
        </svg>
    );
}

function IconTiktok() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16.6 5.82C15.9166 5.03953 15.5399 4.0374 15.54 3H12.45V15.4C12.4267 16.0712 12.1435 16.7071 11.6603 17.1735C11.1771 17.6399 10.5316 17.9004 9.86 17.9C8.44 17.9 7.26 16.74 7.26 15.3C7.26 13.58 8.92 12.29 10.63 12.82V9.66C7.18 9.2 4.16 11.88 4.16 15.3C4.16 18.63 6.92 21 9.85 21C12.99 21 15.54 18.45 15.54 15.3V9.01C16.793 9.90985 18.2974 10.3926 19.84 10.39V7.3C19.84 7.3 17.96 7.39 16.6 5.82Z" fill="#231F20" />
        </svg>
    );
}

function IconYoutube() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z" fill="#231F20" />
        </svg>
    );
}

type FooterData = {
    logo: string;
    social_links: Record<string, string>;
    nav_links: { label: string; href: string }[];
    locations: { title: string; items: string[] }[];
    legal_links: string[];
    copyright: string;
};

const socialIcons: Record<string, React.ComponentType> = {
    instagram: IconInstagram,
    facebook: IconFacebook,
    x: IconX,
    tiktok: IconTiktok,
    youtube: IconYoutube,
};

export function Footer({ data }: { data: FooterData }) {
    return (
        <footer className="rounded-t-[30px] bg-white px-15 pt-20 pb-20">
            <div className="flex flex-col gap-15">
                {/* Top section */}
                <div className="flex items-start justify-between">
                    {/* Logo + socials */}
                    <div className="flex w-67.5 flex-col gap-5">
                        <img
                            src={data.logo}
                            alt="Toyota Musalem"
                            className="h-12 w-auto object-contain object-left"
                        />
                        <div className="flex gap-2.5">
                            {Object.entries(data.social_links).map(([key, url]) => {
                                const Icon = socialIcons[key];
                                if (!Icon) return null;
                                return (
                                    <SocialButton key={key} href={url}>
                                        <Icon />
                                    </SocialButton>
                                );
                            })}
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="flex gap-15">
                        {/* MUSALEM */}
                        <div className="flex w-30 flex-col gap-5">
                            <span className="text-sm leading-none font-normal text-black">
                                MUSALEM
                            </span>
                            {data.nav_links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm leading-none text-black/80 transition hover:text-black"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Locations */}
                        {data.locations.map((loc) => (
                            <div key={loc.title} className="flex flex-col gap-5">
                                <span className="text-base leading-none font-normal uppercase text-black">
                                    {loc.title}
                                </span>
                                {loc.items.map((item, i) => (
                                    <span key={i} className="text-sm leading-none text-black/80">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        ))}

                        {/* LEGALES */}
                        <div className="flex w-40 flex-col gap-5">
                            <span className="text-base leading-none font-normal uppercase text-black">
                                Legales
                            </span>
                            {data.legal_links.map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-sm leading-normal text-black/80 transition hover:text-black"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <span className="text-xs leading-none text-[#231F20]">
                    &copy; {new Date().getFullYear()} {data.copyright}
                </span>
            </div>
        </footer>
    );
}

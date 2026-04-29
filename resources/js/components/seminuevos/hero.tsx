import heroImage from '@images/seminuevos/hero-image.png?format=webp';

export function Hero() {
    return (
        <section className="flex flex-col items-center lg:mt-20">
            <div className="-mx-5 w-[calc(100%+2.5rem)] lg:mx-0 lg:w-full">
                <img
                    src={heroImage}
                    alt="Seminuevos Musalem"
                    className="h-48 w-full object-cover lg:h-auto lg:rounded-[20px]"
                />
            </div>
            <h1 className="py-8 text-center text-2xl font-semibold leading-[150%] text-black lg:py-15 lg:text-[40px]">
                Seminuevos certificados por Musalem
            </h1>
        </section>
    );
}

import heroImage from '@images/seminuevos/hero-image.png?format=webp';

export function Hero() {
    return (
        <section className="mt-20 flex flex-col items-center">
            <img
                src={heroImage}
                alt="Seminuevos Musalem"
                className="w-full rounded-[20px] object-cover"
            />
            <h1 className="py-15 text-center text-[40px] font-semibold leading-[150%] text-black">
                Seminuevos certificados por Musalem
            </h1>
        </section>
    );
}

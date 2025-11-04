import RegistrationDecor from "@/app/components/layout/registration-bg";

export default function RegistrationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <RegistrationDecor />
            {children}
        </section>
    );
}

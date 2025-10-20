import BackgroundDecor from "@/components/layout/background-decor";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <BackgroundDecor />
            {children}
        </>
    );
}

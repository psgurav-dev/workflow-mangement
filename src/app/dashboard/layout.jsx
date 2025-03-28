import Header from "@/components/dashboard/Headers";

export default function RootLayout({ children }) {
	return (
		<div>
			<Header />
			{children}
		</div>
	);
}

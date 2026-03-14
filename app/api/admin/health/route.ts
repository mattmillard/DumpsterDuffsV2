import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminRole } from "@/types/admin";

type RequestingAdmin = {
	id: string;
	email: string;
	role: AdminRole;
	is_active: boolean;
};

type EnvCheck = {
	key: string;
	present: boolean;
	required: boolean;
};

async function getRequestingAdmin(): Promise<RequestingAdmin | null> {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return null;
	}

	const cookieStore = await cookies();

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll() {
				// Not needed for read-only auth checks in this route.
			},
		},
	});

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		return null;
	}

	const { data: adminUser, error: adminError } = await supabase
		.from("admin_users")
		.select("id, email, role, is_active")
		.eq("id", user.id)
		.single();

	if (adminError || !adminUser || !adminUser.is_active) {
		return null;
	}

	return {
		id: adminUser.id,
		email: adminUser.email,
		role: adminUser.role as AdminRole,
		is_active: adminUser.is_active,
	};
}

function getEnvChecks(): EnvCheck[] {
	return [
		{ key: "NEXT_PUBLIC_SUPABASE_URL", present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), required: true },
		{
			key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
			present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
			required: true,
		},
		{ key: "SUPABASE_SERVICE_ROLE_KEY", present: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), required: true },
		{ key: "RESEND_API_KEY", present: Boolean(process.env.RESEND_API_KEY), required: false },
		{ key: "BOOKING_FROM_EMAIL", present: Boolean(process.env.BOOKING_FROM_EMAIL), required: false },
		{
			key: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
			present: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
			required: false,
		},
		{ key: "GOOGLE_MAPS_API_KEY", present: Boolean(process.env.GOOGLE_MAPS_API_KEY), required: false },
		{
			key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
			present: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
			required: false,
		},
		{ key: "STRIPE_SECRET_KEY", present: Boolean(process.env.STRIPE_SECRET_KEY), required: false },
		{ key: "STRIPE_WEBHOOK_SECRET", present: Boolean(process.env.STRIPE_WEBHOOK_SECRET), required: false },
	];
}

export async function GET() {
	try {
		const requestingAdmin = await getRequestingAdmin();

		if (!requestingAdmin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const envChecks = getEnvChecks();
		const missingRequired = envChecks.filter((item) => item.required && !item.present);

		let databaseReachable = false;
		let databaseError: string | null = null;

		try {
			const { error } = await supabaseAdmin.from("admin_users").select("id", { count: "exact", head: true });

			if (error) {
				databaseError = error.message;
			} else {
				databaseReachable = true;
			}
		} catch (error) {
			databaseError = error instanceof Error ? error.message : "Unknown error";
		}

		const status = missingRequired.length === 0 && databaseReachable ? "healthy" : "degraded";

		return NextResponse.json({
			status,
			checked_at: new Date().toISOString(),
			auth: {
				user_id: requestingAdmin.id,
				role: requestingAdmin.role,
			},
			env: envChecks,
			services: {
				database: {
					reachable: databaseReachable,
					error: databaseError,
				},
			},
		});
	} catch (error) {
		console.error("Admin health check error:", error);
		return NextResponse.json({ error: "Failed to run health checks" }, { status: 500 });
	}
}

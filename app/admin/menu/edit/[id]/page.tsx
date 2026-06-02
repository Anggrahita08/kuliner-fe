import FormMenu from "./form";
import { getCookies } from "@/helper/cookies"

export const revalidate = 0;

// Interface untuk response API
export interface MenuResponse {
    success: boolean
    message: string
    data: Menu
}

export interface Menu {
    id: number
    name: string
    category: string
    price: number
    image: any
    description: any
    createdAt: string
    updatedAt: string
}

async function getMenuById(menu_id: string): Promise<Menu | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/menu/${menu_id}`
        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${await getCookies("token_kuliner")}`
            }
        })
        
        const responseData: MenuResponse = await response.json()
        if (!response.ok) return null
        
        return responseData.data
    } catch (error) {
        console.error("Error fetching menu:", error)
        return null
    }
}

type PageProp = {
    params: Promise<{ id: string }>
}

export default async function EditMenuPage(props: PageProp) {
    const { id } = await props.params
    
    const selectedMenu = await getMenuById(id)
    
    console.log("Selected Menu:", selectedMenu)

    if (!selectedMenu) {
        return (
            <div className="flex items-center justify-center min-h-screen p-5 bg-gray-50">
                <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 p-6 rounded-lg shadow-md max-w-md">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">⚠️</span>
                        <div>
                            <h3 className="font-bold text-lg">Menu Not Found</h3>
                            <p className="text-sm mt-1">
                                Sorry, menu item with ID <b className="font-mono">{id}</b> was not found.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <FormMenu menu={selectedMenu} />
        </div>
    )
}
"use client";

import { useState, useMemo } from "react";
import { 
  Button, 
  Card, 
  Badge, 
  Input,
  Modal
} from "@/components/ui";
import { 
  Plus, 
  Search, 
  GripVertical, 
  Edit2, 
  Trash2, 
  EyeOff,
  UtensilsCrossed
} from "lucide-react";
import { toast } from "sonner";
import { MenuCategory, MenuItem, deleteCategory, deleteMenuItem, createCategory, createMenuItem } from "@/services/menu";

interface MenuClientProps {
  initialCategories: any[];
  initialItems: any[];
  restaurantId: string;
}

export function MenuClient({ initialCategories, initialItems, restaurantId }: MenuClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  
  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  // Form states (simplified for now, ideally use react-hook-form)
  const [newCatName, setNewCatName] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category_id: initialCategories[0]?.id || "",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items by search
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await createCategory(newCatName, restaurantId);
      setCategories([...categories, created]);
      setNewCatName("");
      setIsCategoryModalOpen(false);
      toast.success("Categoría creada con éxito");
    } catch (error) {
      toast.error("Error al crear la categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.category_id) {
        toast.error("Por favor completa los campos obligatorios");
        return;
    }
    setIsSubmitting(true);
    try {
      const created = await createMenuItem({
        name: newItem.name,
        price: parseFloat(newItem.price),
        description: newItem.description,
        restaurant_id: restaurantId,
        category_id: newItem.category_id
      });
      setItems([...items, created]);
      setNewItem({ name: "", price: "", category_id: categories[0]?.id || "", description: "" });
      setIsItemModalOpen(false);
      toast.success("Plato añadido con éxito");
    } catch (error) {
      toast.error("Error al añadir el plato");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este plato?")) return;
    try {
      await deleteMenuItem(id);
      setItems(items.filter(i => i.id !== id));
      toast.success("Plato eliminado");
    } catch (error) {
      toast.error("No se pudo eliminar el plato");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Gestión de Carta</h1>
          <p className="text-sm text-on-surface-variant italic">Configura tus categorías y platos disponibles.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCategoryModalOpen(true)}>
                Nueva Categoría
            </Button>
            <Button size="sm" onClick={() => setIsItemModalOpen(true)}>
                <Plus size={16} className="mr-1" />
                Nuevo Plato
            </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="relative max-w-md">
        <Input 
            placeholder="Buscar plato o categoría..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
      </div>

      {/* Categories List */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center justify-between px-2 border-l-4 border-primary pl-4">
               <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-on-surface">{category.name}</h3>
                  <Badge variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary">
                    {filteredItems.filter(i => i.category_id === category.id).length} platos
                  </Badge>
               </div>
               <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-error/70"><Trash2 size={14} /></Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {filteredItems
                 .filter(item => item.category_id === category.id)
                 .map((item) => (
                  <Card key={item.id} className="p-4 bg-surface-container-low border-none flex gap-4 group hover:bg-surface-container transition-colors">
                    <div className="w-20 h-20 rounded-[8px] bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden">
                       {item.image_url ? (
                           <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                       ) : (
                           <UtensilsCrossed size={24} className="text-outline/20" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between items-start gap-2">
                             <h4 className="text-sm font-semibold truncate text-on-surface">{item.name}</h4>
                             <span className="text-sm font-bold text-tertiary">${item.price.toLocaleString('es-CL')}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{item.description || "Sin descripción"}</p>
                       </div>
                       <div className="flex items-center justify-between mt-3">
                          <Badge variant={item.active ? "success" : "secondary"} size="sm" className="text-[10px] py-0 px-2 h-5">
                            {item.active ? "Activo" : "Oculto"}
                          </Badge>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-error/60 hover:text-error"
                                onClick={() => handleDeleteItem(item.id)}
                            >
                                <Trash2 size={14} />
                             </Button>
                          </div>
                       </div>
                    </div>
                  </Card>
               ))}
               {filteredItems.filter(i => i.category_id === category.id).length === 0 && (
                   <div className="col-span-full py-8 text-center border-2 border-dashed border-outline-variant rounded-[8px]">
                       <p className="text-sm text-on-surface-variant">No hay platos en esta categoría</p>
                       <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={() => {
                           setNewItem({...newItem, category_id: category.id});
                           setIsItemModalOpen(true);
                       }}>
                           <Plus size={14} className="mr-1" /> Añadir primer plato
                       </Button>
                   </div>
               )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container/30 rounded-[12px] border-2 border-dashed border-outline-variant">
                <UtensilsCrossed size={48} className="text-outline/20 mb-4" />
                <h3 className="text-lg font-medium text-on-surface">Tu carta está vacía</h3>
                <p className="text-sm text-on-surface-variant mb-6 text-center max-w-xs">
                    Comienza creando una categoría como "Entradas" o "Platos Principales".
                </p>
                <Button onClick={() => setIsCategoryModalOpen(true)}>
                    <Plus size={18} className="mr-2" /> Crear mi primera categoría
                </Button>
            </div>
        )}
      </div>

      {/* Category Modal */}
      <Modal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        title="Nueva Categoría"
      >
        <div className="space-y-4 py-4">
            <Input 
                label="Nombre de la categoría" 
                placeholder="Ej: Entradas, Pastas, Postres..." 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
            />
            <Button 
                fullWidth 
                className="mt-4" 
                onClick={handleCreateCategory}
                loading={isSubmitting}
            >
                Crear Categoría
            </Button>
        </div>
      </Modal>

      {/* Item Modal */}
      <Modal 
        isOpen={isItemModalOpen} 
        onClose={() => setIsItemModalOpen(false)} 
        title="Nuevo Plato"
      >
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                  <Input 
                    label="Nombre del plato" 
                    placeholder="Ej: Cebiche del Puerto" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
               </div>
               <Input 
                label="Precio ($)" 
                type="number"
                placeholder="12000" 
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
               />
               <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Categoría</label>
                  <select 
                    className="h-[40px] w-full px-3 rounded-[8px] bg-surface-container-high border-none text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newItem.category_id}
                    onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}
                  >
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
               </div>
               <div className="col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Descripción (opcional)</label>
                  <textarea 
                    className="w-full p-3 rounded-[8px] bg-surface-container-high border-none text-sm min-h-[80px] focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Detalla los ingredientes o preparación..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
               </div>
            </div>
            
            <Button 
                fullWidth 
                className="mt-4" 
                onClick={handleCreateItem}
                loading={isSubmitting}
            >
                Añadir Plato a la Carta
            </Button>
        </div>
      </Modal>
    </div>
  );
}

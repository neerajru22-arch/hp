
import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { MenuEngineeringCategory, MenuEngineeringItem, UserRole } from '../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const categoryDetails = {
    [MenuEngineeringCategory.Star]: {
        title: "Stars",
        description: "High Profitability, High Popularity",
        color: "bg-green-100 border-green-500",
        advice: "Maintain quality. Feature prominently on the menu.",
    },
    [MenuEngineeringCategory.Plowhorse]: {
        title: "Plowhorses",
        description: "Low Profitability, High Popularity",
        color: "bg-blue-100 border-blue-500",
        advice: "Increase price slightly or reduce cost. Test combos.",
    },
    [MenuEngineeringCategory.Puzzle]: {
        title: "Puzzles",
        description: "High Profitability, Low Popularity",
        color: "bg-yellow-100 border-yellow-500",
        advice: "Promote this item. Better menu placement or description.",
    },
    [MenuEngineeringCategory.Dog]: {
        title: "Dogs",
        description: "Low Profitability, Low Popularity",
        color: "bg-red-100 border-red-500",
        advice: "Consider removing from the menu or re-engineering the recipe.",
    },
};

const MenuEngineeringItemCard: React.FC<{ item: MenuEngineeringItem }> = ({ item }) => {
    const details = categoryDetails[item.classification];
    return (
        <div className={`p-3 rounded-lg border-l-4 ${details.color} bg-white shadow-sm`}>
            <h4 className="font-bold text-secondary">{item.name}</h4>
            <div className="mt-2 text-sm text-slate-700 space-y-1">
                <p><span className="font-semibold">Sold:</span> {item.unitsSold} units</p>
                <p><span className="font-semibold">Profit/Item:</span> {formatCurrency(item.profitPerItem)}</p>
                <p><span className="font-semibold">Total Profit:</span> {formatCurrency(item.totalProfit)}</p>
            </div>
        </div>
    );
};

const Quadrant: React.FC<{ category: MenuEngineeringCategory, items: MenuEngineeringItem[] }> = ({ category, items }) => {
    const details = categoryDetails[category];
    return (
        <div className={`p-4 rounded-lg flex flex-col ${details.color.replace('border-green-500', 'bg-green-50').replace('border-blue-500', 'bg-blue-50').replace('border-yellow-500', 'bg-yellow-50').replace('border-red-500', 'bg-red-50')}`}>
            <div className="border-b-2 pb-2 mb-4" style={{borderColor: categoryDetails[category].color.split(' ')[1].replace('border-','border-')}}>
                <h3 className="font-bold text-xl text-secondary">{details.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{details.description}</p>
                <p className="text-xs italic text-slate-500 mt-1">{details.advice}</p>
            </div>
            <div className="space-y-3 overflow-y-auto flex-grow pr-2 -mr-2">
                {items.length > 0 ? (
                    items.map(item => <MenuEngineeringItemCard key={item.id} item={item} />)
                ): (
                    <p className="text-sm text-slate-500 text-center pt-8">No items in this category.</p>
                )}
            </div>
        </div>
    );
};


const MenuEngineering: React.FC = () => {
    const { user, selectedOutlet } = useAuth();
    
    if (!user || ![UserRole.Admin, UserRole.RestaurantOwner, UserRole.Chef].includes(user.role)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
                <p className="text-slate-600 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const { data: report, loading, error } = useApi(api.getMenuEngineeringReport, selectedOutlet?.id || '');

    if (!selectedOutlet) {
        return <div className="text-center p-8">Please select an outlet to view the menu engineering report.</div>
    }

    const categorizedItems = {
        [MenuEngineeringCategory.Star]: report?.filter(item => item.classification === MenuEngineeringCategory.Star) || [],
        [MenuEngineeringCategory.Plowhorse]: report?.filter(item => item.classification === MenuEngineeringCategory.Plowhorse) || [],
        [MenuEngineeringCategory.Puzzle]: report?.filter(item => item.classification === MenuEngineeringCategory.Puzzle) || [],
        [MenuEngineeringCategory.Dog]: report?.filter(item => item.classification === MenuEngineeringCategory.Dog) || [],
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Menu Engineering for {selectedOutlet.name}</h2>
            <p className="text-slate-600">Analyze the popularity and profitability of your menu items to make smarter business decisions.</p>

             {loading && <div className="text-center p-8">Analyzing sales data...</div>}
             {error && <div className="text-center p-8 text-danger">Failed to generate report.</div>}
            
            {report && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[70vh]">
                    <Quadrant category={MenuEngineeringCategory.Star} items={categorizedItems.Star} />
                    <Quadrant category={MenuEngineeringCategory.Puzzle} items={categorizedItems.Puzzle} />
                    <Quadrant category={MenuEngineeringCategory.Plowhorse} items={categorizedItems.Plowhorse} />
                    <Quadrant category={MenuEngineeringCategory.Dog} items={categorizedItems.Dog} />
                </div>
            )}
        </div>
    );
};

export default MenuEngineering;

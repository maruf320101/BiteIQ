import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  QrCode, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  LogOut, 
  Download, 
  UtensilsCrossed, 
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { RESTAURANT_INFO, MENU_ITEMS } from '../data/restaurantData';

export default function AdminDashboardView({
  completedOrders,
  onLogout,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'menu' | 'managers' | 'qrcodes'
  const [menuList, setMenuList] = useState(MENU_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');

  // Manager accounts list
  const [managers, setManagers] = useState([
    { id: 'm1', name: 'Kabir Ahmed', email: 'manager@biteiq.com', shift: 'Morning & Evening', status: 'Active' },
    { id: 'm2', name: 'Tanvir Hossain', email: 'tanvir.manager@biteiq.com', shift: 'Night Shift', status: 'Active' }
  ]);
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerEmail, setNewManagerEmail] = useState('');

  // Financial metrics
  const totalRevenue = completedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrdersCount = completedOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  const handleAddManager = (e) => {
    e.preventDefault();
    if (!newManagerName.trim() || !newManagerEmail.trim()) return;

    setManagers((prev) => [
      ...prev,
      {
        id: 'm_' + Date.now(),
        name: newManagerName,
        email: newManagerEmail,
        shift: 'General Operations',
        status: 'Active'
      }
    ]);
    setNewManagerName('');
    setNewManagerEmail('');
  };

  const handleToggleItemStatus = (id) => {
    setMenuList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOutOfStock: !item.isOutOfStock } : item
      )
    );
  };

  const filteredMenu = menuList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto animate-fadeIn flex flex-col justify-between">
      {/* Admin Executive Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-lg">
              ADM
            </div>
            <div>
              <h2 className="text-base font-black flex items-center gap-2">
                BiteIQ Executive Administration
                <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  Super Admin
                </span>
              </h2>
              <p className="text-xs text-slate-400">admin@biteiq.com • Enterprise Ownership</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
            >
              Customer Storefront
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Gross Revenue
            </span>
            <div className="text-3xl font-black text-slate-900">৳{totalRevenue}</div>
            <p className="text-[11px] text-emerald-600 font-semibold">Live Real-time Settlement</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Completed Orders
            </span>
            <div className="text-3xl font-black text-slate-900">{totalOrdersCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Fulfilled dining sessions</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" /> Active Menu Items
            </span>
            <div className="text-3xl font-black text-slate-900">{menuList.length}</div>
            <p className="text-[11px] text-slate-500 font-medium">Across all categories</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-600" /> Manager Accounts
            </span>
            <div className="text-3xl font-black text-slate-900">{managers.length}</div>
            <p className="text-[11px] text-purple-600 font-medium">Operational Supervisors</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'analytics'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Business & Audit Logs
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'menu'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Menu Catalog & Pricing
          </button>

          <button
            onClick={() => setActiveTab('managers')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'managers'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manager Account Management
          </button>

          <button
            onClick={() => setActiveTab('qrcodes')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'qrcodes'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Table QR Generation
          </button>
        </div>

        {/* TAB 1: BUSINESS & BILLING AUDIT */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Completed Customer Dining Invoices
            </h3>

            {completedOrders.length === 0 ? (
              <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                <p className="text-sm font-bold text-slate-700">No completed orders recorded yet.</p>
                <p className="text-xs text-slate-400">Invoices will show up automatically when the manager fulfills orders.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Dining Table</th>
                      <th className="p-4">Dishes Ordered</th>
                      <th className="p-4">Total Settled</th>
                      <th className="p-4">Financial Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedOrders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-800">TX-{ord.orderId}</td>
                        <td className="p-4 font-bold text-orange-600">Table {ord.tableNumber}</td>
                        <td className="p-4 text-slate-600">
                          {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="p-4 font-black text-slate-900">৳{ord.total}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            Paid & Closed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU CATALOG & INVENTORY */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Gastronomy Menu Master Catalog ({menuList.length})
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-3xl p-4 flex gap-4 items-center justify-between shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.category} • ⏱ {item.prepTime} mins</p>
                    <p className="text-xs font-black text-slate-900 mt-0.5">৳{item.price}</p>
                  </div>
                  <button
                    onClick={() => handleToggleItemStatus(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.isOutOfStock
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.isOutOfStock ? 'Out of Stock' : 'Active'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGER ACCOUNTS */}
        {activeTab === 'managers' && (
          <div className="space-y-6">
            {/* Create new manager form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Create New Shift Manager ID
              </h3>
              <form onSubmit={handleAddManager} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Manager Full Name"
                  value={newManagerName}
                  onChange={(e) => setNewManagerName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Work Email (e.g. rofiq@biteiq.com)"
                  value={newManagerEmail}
                  onChange={(e) => setNewManagerEmail(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Manager</span>
                </button>
              </form>
            </div>

            {/* Existing Managers Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Shift Assignment</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managers.map((m) => (
                    <tr key={m.id}>
                      <td className="p-4 font-bold text-slate-900">{m.name}</td>
                      <td className="p-4 text-slate-600 font-mono">{m.email}</td>
                      <td className="p-4 text-slate-500">{m.shift}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TABLE QR GENERATION */}
        {activeTab === 'qrcodes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Table QR Routing Directory
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                <div key={t} className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-2">
                  <div className="font-extrabold text-slate-900 text-base">Table {t}</div>
                  <code className="text-[10px] text-orange-600 block truncate">?table={t}</code>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    Active Target
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="bg-slate-900 text-slate-400 py-3.5 px-6 text-center text-xs">
        BiteIQ Executive Suite • System Ownership & Revenue Management
      </footer>
    </div>
  );
}

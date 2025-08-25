import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import NewsAdminForm from "../../components/NewsManagement";
import StaffAdminForm from "../../components/StaffManagement";
import { getNews, deleteNews, updateNews } from "../../services/api";
import axios from "axios";
import ActionButtons from "../../components/ActionButton";

interface NewsArticle {
  _id: string;
  title: string;
  type: string;
  content: string;
}

interface StaffMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  contact: string;
}

const AdminDashboard = () => {
  const { token } = useAuth();

  type Tab = "addNews" | "newsList" | "addStaff" | "staffList";
  const [activeTab, setActiveTab] = useState<Tab>("addNews");

  // News states
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);

  // Staff states
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const response = await getNews();
      setNewsList(response.data);
    } catch (error) {
      console.error("Failed to fetch news", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(response.data);
    } catch (error) {
      console.error("Failed to fetch staff", error);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchStaff();
  }, []);

  const handleNewsAdded = () => {
    fetchNews();
    setActiveTab("newsList");
  };

  const handleStaffAdded = () => {
    fetchStaff();
    setActiveTab("staffList");
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    setDeletingNewsId(id);
    try {
      await deleteNews(id, token!);
      fetchNews();
    } catch {
      alert("Failed to delete news.");
    } finally {
      setDeletingNewsId(null);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    setDeletingStaffId(id);
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff();
    } catch {
      alert("Failed to delete staff member.");
    } finally {
      setDeletingStaffId(null);
    }
  };

  const startEditNews = (news: NewsArticle) => setEditingNews(news);
  const cancelEditNews = () => setEditingNews(null);

  const saveEditNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingNews) return;

    const formData = new FormData(e.currentTarget);
    try {
      await updateNews(
        editingNews._id,
        {
          title: formData.get("title") as string,
          type: formData.get("type") as string,
          content: formData.get("content") as string,
        },
        token!
      );
      fetchNews();
      setEditingNews(null);
      alert("News updated successfully.");
    } catch {
      alert("Failed to update news.");
    }
  };

  const startEditStaff = (staff: StaffMember) => setEditingStaff(staff);
  const cancelEditStaff = () => setEditingStaff(null);

  const saveEditStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStaff) return;

    const formData = new FormData(e.currentTarget);
    try {
      await axios.put(
        `http://localhost:5000/api/staff/${editingStaff._id}`,
        {
          name: formData.get("name") as string,
          role: formData.get("role") as string,
          department: formData.get("department") as string,
          location: formData.get("location") as string,
          contact: formData.get("contact") as string,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStaff();
      setEditingStaff(null);
      alert("Staff updated successfully.");
    } catch {
      alert("Failed to update staff.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="w-64 bg-gray-800 p-6 space-y-6 shadow-lg fixed h-full">
        <h1 className="text-white text-2xl font-bold mb-12">Admin Dashboard</h1>
        {[
          { key: "addNews", label: "Add News" },
          { key: "newsList", label: "News List" },
          { key: "addStaff", label: "Add Staff" },
          { key: "staffList", label: "Staff List" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`block w-full text-left px-4 py-3 rounded transition ${
              activeTab === key
                ? "bg-gray-700 font-semibold text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setActiveTab(key as Tab)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="flex-1 ml-64 p-8 overflow-auto">
        {activeTab === "addNews" && (
          <>
            <h2 className="text-3xl font-semibold mb-6">Add News Article</h2>
            <NewsAdminForm onNewsAdded={handleNewsAdded} />
          </>
        )}

        {activeTab === "newsList" && (
          <>
            <h2 className="text-3xl font-semibold mb-6">News Articles</h2>
            {editingNews ? (
              <form onSubmit={saveEditNews} className="space-y-4 max-w-lg border p-4 rounded bg-white dark:bg-gray-800">
                <div>
                  <label className="block mb-1" htmlFor="title">Title</label>
                  <input id="title" name="title" defaultValue={editingNews.title} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1" htmlFor="type">Type</label>
                  <select name="type" id="type" defaultValue={editingNews.type} required className="w-full px-3 py-2 border rounded">
                    <option>Announcement</option>
                    <option>Update</option>
                    <option>Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1" htmlFor="content">Content</label>
                  <textarea id="content" name="content" defaultValue={editingNews.content} required className="w-full px-3 py-2 border rounded" rows={5} />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                  <button type="button" onClick={cancelEditNews} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                </div>
              </form>
            ) : newsList.length === 0 ? (
              <p>No news found.</p>
            ) : (
              <ul className="space-y-4">
                {newsList.map((news) => (
                  <li key={news._id} className="border rounded p-4 shadow-sm flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{news.title}</h3>
                      <p className="text-gray-500 font-medium">{news.type}</p>
                      <p className="mt-2">{news.content}</p>
                    </div>
                    <ActionButtons
                      onEdit={() => startEditNews(news)}
                      onDelete={() => handleDeleteNews(news._id)}
                      isDeleting={deletingNewsId === news._id}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {activeTab === "addStaff" && (
          <>
            <h2 className="text-3xl font-semibold mb-6">Add Staff Member</h2>
            <StaffAdminForm onStaffAdded={handleStaffAdded} />
          </>
        )}

        {activeTab === "staffList" && (
          <>
            <h2 className="text-3xl font-semibold mb-6">Staff Members</h2>
            {editingStaff ? (
              <form onSubmit={saveEditStaff} className="space-y-4 max-w-lg border p-4 rounded bg-white dark:bg-gray-800">
                <div>
                  <label className="block mb-1" htmlFor="name">Name</label>
                  <input id="name" name="name" defaultValue={editingStaff.name} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1" htmlFor="role">Role</label>
                  <input id="role" name="role" defaultValue={editingStaff.role} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1" htmlFor="department">Department</label>
                  <input id="department" name="department" defaultValue={editingStaff.department} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1" htmlFor="location">Location</label>
                  <input id="location" name="location" defaultValue={editingStaff.location} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1" htmlFor="contact">Contact</label>
                  <input id="contact" name="contact" defaultValue={editingStaff.contact} required className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                  <button type="button" onClick={cancelEditStaff} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                </div>
              </form>
            ) : staffList.length === 0 ? (
              <p>No staff members found.</p>
            ) : (
              <ul className="space-y-4">
                {staffList.map((staff) => (
                  <li key={staff._id} className="border rounded p-4 shadow-sm flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{staff.name}</h3>
                      <p className="text-gray-500 font-medium">{staff.role}</p>
                      <p>{staff.department} - {staff.location}</p>
                      <p>Contact: {staff.contact}</p>
                    </div>
                    <ActionButtons
                      onEdit={() => startEditStaff(staff)}
                      onDelete={() => handleDeleteStaff(staff._id)}
                      isDeleting={deletingStaffId === staff._id}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

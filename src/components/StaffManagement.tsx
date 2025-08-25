// src/components/StaffManagement.tsx (Add Staff Form Component)
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface AddStaffMemberProps {
  onStaffAdded: () => void;
}

const StaffAdminForm: React.FC<AddStaffMemberProps> = ({ onStaffAdded }) => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const departments = [
    "Board of Directors",
    "HR",
    "Sales",
    "Engineering",
    "Marketing",
    "Support",
  ]; // Example department options

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/staff",
        { name, role, department, location, contact },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Staff member added.");
      setName("");
      setRole("");
      setDepartment("");
      setLocation("");
      setContact("");
      onStaffAdded(); // refresh list in parent
    } catch {
      alert("Failed to add staff member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {/* Name */}
      <div>
        <label className="block mb-1" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter full name"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block mb-1" htmlFor="role">Role</label>
        <input
          id="role"
          type="text"
          value={role}
          required
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter role (e.g. Manager)"
        />
      </div>

      {/* Department Dropdown */}
      <div>
        <label className="block mb-1" htmlFor="department">Department</label>
        <select
          id="department"
          value={department}
          required
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="" disabled>
            Select department
          </option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block mb-1" htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          value={location}
          required
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter location (e.g. New York)"
        />
      </div>

      {/* Contact / Email */}
      <div>
        <label className="block mb-1" htmlFor="contact">Contact (Email)</label>
        <input
          id="contact"
          type="email"
          value={contact}
          required
          onChange={(e) => setContact(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="example@company.com"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Adding..." : "Add Staff"}
      </button>
    </form>
  );
};

export default StaffAdminForm;

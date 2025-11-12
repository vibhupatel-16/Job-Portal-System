import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/reset-password/${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-1/2 border border-gray-200 rounded-md p-6 my-10"
        >
          <h1 className="font-bold text-xl mb-5 text-center">
            Reset Password
          </h1>

          <div className="my-4">
            <Label>New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="my-4">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Please Wait..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

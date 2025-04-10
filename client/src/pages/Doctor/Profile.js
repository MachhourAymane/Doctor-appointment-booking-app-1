import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../../components/DoctorForm";
import moment from "moment";
import { Skeleton } from "antd";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const getDoctorData = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-user-id",
        {
          userId: params.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      } else {
        console.error("Failed to fetch doctor data:", response.data.message);
        toast.error("Failed to load doctor information.");
        setDoctor(null); // Explicitly set doctor to null if data is invalid
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      dispatch(hideLoading());
      toast.error("An error occurred while fetching doctor data.");
      setDoctor(null); // Explicitly set doctor to null on error
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  }, [params.userId, dispatch]);

  useEffect(() => {
    getDoctorData();
  }, [getDoctorData]);

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />

      {/* Show loading placeholder if data is still being fetched */}
      {loading ? (
        <div style={{ padding: "20px" }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <div>
          {/* Render the form with fallback values if doctor data is unavailable */}
          <DoctorForm
            onFinish={onFinish}
            initialValues={
              doctor || {
                firstName: "Not Provided",
                lastName: "Not Provided",
                phoneNumber: "Not Provided",
                address: "Not Provided",
                specialization: "Not Provided",
                experience: "Not Provided",
                feePerCunsultation: "Not Provided",
                timings: ["09:00", "17:00"], // Default timings
              }
            }
          />
        </div>
      )}
    </Layout>
  );
}

export default Profile;
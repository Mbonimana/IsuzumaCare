import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BookingFormData, Service } from '../types';
import { serviceApi } from '../services/api';
import toast from 'react-hot-toast';

interface AppointmentFormProps {
  selectedDate: Date | null;
  selectedTime: string;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedDate,
  selectedTime,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    date: null,
    time: '',
    notes: '',
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  useEffect(() => {
    // Load services
    loadServices();
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: selectedDate,
      time: selectedTime,
    }));
  }, [selectedDate, selectedTime]);

  const loadServices = async () => {
    try {
      // For demo purposes, using static services
      // In production, this would fetch from the API
      const demoServices: Service[] = [
        { id: '1', name: 'General Consultation', duration: 30, price: 50 },
        { id: '2', name: 'Follow-up Visit', duration: 15, price: 30 },
        { id: '3', name: 'Annual Check-up', duration: 60, price: 100 },
        { id: '4', name: 'Specialist Consultation', duration: 45, price: 80 },
      ];
      setServices(demoServices);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email format';
    }

    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.clientPhone)) {
      newErrors.clientPhone = 'Invalid phone format';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.date) {
      newErrors.date = null;
      toast.error('Please select a date');
    }

    if (!formData.time) {
      newErrors.time = '';
      toast.error('Please select a time');
    }

    setErrors(newErrors);
import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Users, MapPin, Star, ArrowRight, ChevronRight } from 'lucide-react';
import { tournamentAPI, userAPI } from '../services/api';

const CricketTournamentLanding = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        console.log('🔄 Fetching tournaments from API...');
        setLoading(true);
        const tournamentsData = await tournamentAPI.getAllTournaments();
        console.log('✅ Tournaments fetched:', tournamentsData);
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('❌ Error fetching tournaments:', error);
        setError('Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    email: '',
    state: '',
    district: '',
    pincode: '',
    type: '',
    batsmanHanded: '',
    bowlerHanded: '',
    bowlerType: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    whatsappNumber: '',
    email: '',
    state: '',
    district: '',
    pincode: '',
    type: '',
    batsmanHanded: '',
    bowlerHanded: '',
    bowlerType: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: '',
    title: ''
  });

  // Notification functions
  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters long';
        }
        break;
        
      case 'whatsappNumber':
        if (!value.trim()) {
          error = 'WhatsApp number is required';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'WhatsApp number must be a 10-digit number';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'state':
        if (!value) {
          error = 'State is required';
        }
        break;
        
      case 'district':
        if (!value) {
          error = 'District is required';
        }
        break;
        
      case 'pincode':
        if (!value.trim()) {
          error = 'Pincode is required';
        } else if (!/^\d{6}$/.test(value)) {
          error = 'Pincode must be a 6-digit number';
        }
        break;
        
      case 'type':
        if (!value) {
          error = 'Player type is required';
        }
        break;
        
      case 'batsmanHanded':
        if ((formData.type === 'Batsman' || formData.type === 'All Rounder') && !value) {
          error = 'Batsman handedness is required';
        }
        break;
        
      case 'bowlerHanded':
        if ((formData.type === 'Bowler' || formData.type === 'All Rounder') && !value) {
          error = 'Bowler handedness is required';
        }
        break;
        
      case 'bowlerType':
        if ((formData.type === 'Bowler' || formData.type === 'All Rounder') && !value) {
          error = 'Bowler type is required';
        }
        break;
        
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      } else {
        newErrors[key] = '';
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => {
    setErrors({
      fullName: '',
      whatsappNumber: '',
      email: '',
      state: '',
      district: '',
      pincode: '',
      type: '',
      batsmanHanded: '',
      bowlerHanded: '',
      bowlerType: '',
      general: ''
    });
  };

  // Input validation handlers
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Update form data with cleaned value
    setFormData({
      ...formData,
      [name]: numericValue
    });
    
    // Validate field
    const error = validateField(name, numericValue);
    setErrors({
      ...errors,
      [name]: error
    });
    
    // Clear general error
    if (errors.general) {
      setErrors({
        ...errors,
        general: ''
      });
    }
  };

  const handlePincodeInput = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    
    // Update form data with cleaned value
    setFormData({
      ...formData,
      [name]: numericValue
    });
    
    // Validate field
    const error = validateField(name, numericValue);
    setErrors({
      ...errors,
      [name]: error
    });
    
    // Clear general error
    if (errors.general) {
      setErrors({
        ...errors,
        general: ''
      });
    }
  };


  const handleNameInput = (e) => {
    const { name, value } = e.target;
    // Only allow letters, spaces, and basic punctuation
    const nameValue = value.replace(/[^a-zA-Z\s.'-]/g, '');
    
    // Update form data with cleaned value
    setFormData({
      ...formData,
      [name]: nameValue
    });
    
    // Validate field
    const error = validateField(name, nameValue);
    setErrors({
      ...errors,
      [name]: error
    });
    
    // Clear general error
    if (errors.general) {
      setErrors({
        ...errors,
        general: ''
      });
    }
  };

  // State to District mapping
  const stateDistricts = {
    'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
    'Arunachal Pradesh': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kurung Kumey', 'Kra Daadi', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Siang', 'Upper Siang', 'Lower Siang', 'Lower Dibang Valley', 'Dibang Valley', 'Anjaw', 'Lohit', 'Namsai', 'Changlang', 'Tirap', 'Longding'],
    'Assam': ['Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Dima Hasao', 'Sivasagar', 'Sonitpur', 'South Salmara Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'],
    'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
    'Chhattisgarh': ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Janjgir Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja'],
    'Goa': ['North Goa', 'South Goa'],
    'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udepur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
    'Haryana': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
    'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
    'Jharkhand': ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'],
    'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
    'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
    'Madhya Pradesh': ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'],
    'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
    'Manipur': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'],
    'Meghalaya': ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
    'Mizoram': ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip', 'Saitual', 'Khawzawl'],
    'Nagaland': ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'],
    'Odisha': ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh'],
    'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran'],
    'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'],
    'Sikkim': ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'],
    'Tamil Nadu': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'],
    'Telangana': ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal Malkajgiri', 'Nagarkurnool', 'Nalgonda', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'],
    'Tripura': ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
    'Uttar Pradesh': ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
    'Uttarakhand': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
    'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Bardhaman', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'],
    'Andaman and Nicobar Islands': ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
    'Chandigarh': ['Chandigarh'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
    'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
    'Jammu and Kashmir': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'],
    'Ladakh': ['Kargil', 'Leh'],
    'Lakshadweep': ['Lakshadweep'],
    'Puducherry': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam']
  };

  // Filter tournaments based on status
  const upcomingTournaments = tournaments.filter(tournament => 
    tournament.status === 'upcoming' || tournament.status === 'active'
  ).map(tournament => ({
    id: tournament._id,
    title: tournament.title,
    date: `${new Date(tournament.startDate).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}`,
    venue: tournament.venue,
    teams: tournament.maxTeams,
    prizePool: `₹${tournament.prizePool.toLocaleString()}`,
    status: new Date(tournament.registrationDeadline) > new Date() ? 'Registration Open' : 'Coming Soon',
    image: '🏏'
  }));

  const previousTournaments = tournaments.filter(tournament => 
    tournament.status === 'completed'
  ).map(tournament => ({
    id: tournament._id,
    title: tournament.title,
    date: `${new Date(tournament.startDate).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}`,
    winner: tournament.winner || 'TBD',
    runner: tournament.runnerUp || 'TBD',
    teams: tournament.maxTeams,
    image: '🏆'
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate field in real-time
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
    
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors({
        ...errors,
        general: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing general errors
    clearErrors();
    
    // Validate entire form
    if (!validateForm()) {
      // Form has validation errors
      setErrors({
        ...errors,
        general: 'Please fix the errors above before submitting.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      console.log('Submitting form data:', submissionData);
      
      const response = await userAPI.registerUser(submissionData);

      console.log('Registration success:', response);
      
      // Update tournament registered teams counter
      if (selectedTournament) {
        setTournaments(prevTournaments => 
          prevTournaments.map(tournament => 
            tournament._id === selectedTournament._id 
              ? { ...tournament, registeredTeams: tournament.registeredTeams + 1 }
              : tournament
          )
        );
      }
      
      // Success
      showNotification('success', 'Registration Successful!', 'Your cricket tournament registration has been submitted successfully. We will contact you soon with further details.');
      
      // Close modal and reset selected tournament
      setShowRegistration(false);
      setSelectedTournament(null);
      
      // Reset form
      setFormData({
        fullName: '',
        whatsappNumber: '',
        email: '',
        state: '',
        district: '',
        pincode: '',
        type: '',
        batsmanHanded: '',
        bowlerHanded: '',
        bowlerType: ''
      });
      clearErrors();
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        general: 'Network error. Please check your connection and try again.'
      });
      showNotification('error', 'Network Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Notification Component */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg border-l-4 ${
          notification.type === 'success' ? 'border-green-500' : 
          notification.type === 'error' ? 'border-red-500' : 
          'border-blue-500'
        }`}>
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 
                  notification.type === 'error' ? 'text-red-800' : 
                  'text-blue-800'
                }`}>
                  {notification.title}
                </h3>
                <div className={`mt-1 text-sm ${
                  notification.type === 'success' ? 'text-green-700' : 
                  notification.type === 'error' ? 'text-red-700' : 
                  'text-blue-700'
                }`}>
                  {notification.message}
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={hideNotification}
                  className={`inline-flex rounded-md p-1.5 ${
                    notification.type === 'success' ? 'text-green-500 hover:text-green-700' : 
                    notification.type === 'error' ? 'text-red-500 hover:text-red-700' : 
                    'text-blue-500 hover:text-blue-700'
                  } focus:outline-none`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between min-h-[60px]">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 sm:p-3 rounded-full flex-shrink-0">
                <span className="text-white text-xl sm:text-2xl font-bold">🏏</span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent leading-tight truncate">
                  100 Balls Tournament
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm leading-tight hidden sm:block">Where Champions Are Made</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
              The Ultimate <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Cricket Experience</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join the most exciting 100-ball cricket tournament where speed meets skill, and every ball counts towards glory!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button 
                onClick={() => setShowRegistration(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg font-semibold shadow-xl transform transition hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Trophy className="w-5 sm:w-6 h-5 sm:h-6" />
                <span>Join Tournament</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
              <button 
                onClick={() => setActiveTab('previous')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg font-semibold transition duration-300 flex items-center justify-center space-x-2"
              >
                <Star className="w-5 sm:w-6 h-5 sm:h-6" />
                <span>View Champions</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-2 rounded-full flex space-x-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-8 py-3 rounded-full font-semibold transition duration-300 flex items-center space-x-2 ${
                  activeTab === 'upcoming' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Upcoming</span>
              </button>
              <button
                onClick={() => setActiveTab('previous')}
                className={`px-8 py-3 rounded-full font-semibold transition duration-300 flex items-center space-x-2 ${
                  activeTab === 'previous' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span>Previous</span>
              </button>
            </div>
          </div>

          {/* Tournament Cards */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tournaments...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Tournaments</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                const filteredTournaments = tournaments.filter(tournament => {
                  return activeTab === 'upcoming' 
                    ? tournament.status === 'upcoming' || tournament.status === 'active'
                    : tournament.status === 'completed';
                });
                console.log(`📊 Displaying ${filteredTournaments.length} tournaments for tab: ${activeTab}`);
                console.log('📋 Filtered tournaments:', filteredTournaments);
                return filteredTournaments;
              })()
              .map((tournament) => (
                  <div key={tournament._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-5xl mb-2">🏏</div>
                          <h3 className="text-2xl font-bold">{tournament.title}</h3>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          tournament.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                          tournament.status === 'active' ? 'bg-green-100 text-green-800' :
                          tournament.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{tournament.venue}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Users className="w-5 h-5 mr-2" />
                          <span>{tournament.registeredTeams}/{tournament.maxTeams} Teams</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Trophy className="w-5 h-5 mr-2" />
                          <span>Prize Pool: ₹{tournament.prizePool.toLocaleString()}</span>
                        </div>
                        
                        <div className="pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Registration Progress</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {Math.round((tournament.registeredTeams / tournament.maxTeams) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full" 
                              style={{ width: `${Math.round((tournament.registeredTeams / tournament.maxTeams) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <button 
                            onClick={() => {
                              setSelectedTournament(tournament);
                              setShowRegistration(true);
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition duration-300"
                          >
                            Register Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full inline-block mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Player Registration</h2>
                <p className="text-gray-600">Join the 100 Balls Tournament</p>
              </div>
              
              {/* General Error Display */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800 font-medium">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleNameInput}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 uppercase ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleNumberInput}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                      errors.whatsappNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter WhatsApp number"
                    maxLength={10}
                    required
                  />
                  {errors.whatsappNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District *
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">Select District</option>
                    {formData.state && stateDistricts[formData.state]?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handlePincodeInput}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                      errors.pincode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter pincode"
                    maxLength={6}
                    required
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All Rounder">All Rounder</option>
                  </select>
                </div>

                {/* Batsman Handed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Batsman Handed
                  </label>
                  <select
                    name="batsmanHanded"
                    value={formData.batsmanHanded}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Select</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                    <option value="NA">NA</option>
                  </select>
                </div>

                {/* Bowler Handed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bowler Handed
                  </label>
                  <select
                    name="bowlerHanded"
                    value={formData.bowlerHanded}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Select</option>
                    <option value="Left Handed">Left Handed</option>
                    <option value="Right Handed">Right Handed</option>
                    <option value="NA">NA</option>
                  </select>
                </div>

                {/* Bowler Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bowler Type
                  </label>
                  <select
                    name="bowlerType"
                    value={formData.bowlerType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Select</option>
                    <option value="Pace/Fast">Pace/Fast</option>
                    <option value="Medium">Medium</option>
                    <option value="Spin/Slow">Spin/Slow</option>
                  </select>
                </div>

              </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegistration(false);
                      setSelectedTournament(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full">
              <span className="text-white text-2xl font-bold">🏏</span>
            </div>
            <h3 className="text-2xl font-bold">100 Balls Tournament</h3>
          </div>
          <p className="text-gray-400 mb-4">Where Champions Are Made</p>
          <p className="text-gray-500 text-sm">
            © 2025 100 Balls Tournament. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CricketTournamentLanding;
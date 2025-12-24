import { Lead, User, Vendor } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@company.com', role: 'admin', assignedLeads: 45, convertedLeads: 32 },
  { id: '2', name: 'Rahul Patel', email: 'rahul@company.com', role: 'agent', assignedLeads: 38, convertedLeads: 25 },
  { id: '3', name: 'Anjali Gupta', email: 'anjali@company.com', role: 'agent', assignedLeads: 52, convertedLeads: 41 },
  { id: '4', name: 'Vikram Singh', email: 'vikram@company.com', role: 'agent', assignedLeads: 29, convertedLeads: 18 },
  { id: '5', name: 'Neha Kapoor', email: 'neha@company.com', role: 'agent', assignedLeads: 41, convertedLeads: 35 },
];

export const mockLeads: Lead[] = [
  { id: '1', name: 'Amit Kumar', email: 'amit@gmail.com', phone: '+91 98765 43210', vertical: 'app-b2b', status: 'new', source: 'meta', assignedTo: null, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z', notes: [] },
  { id: '2', name: 'Sneha Reddy', email: 'sneha@gmail.com', phone: '+91 87654 32109', vertical: 'wedding-course', status: 'contacted', source: 'meta', assignedTo: '2', createdAt: '2024-01-15T09:15:00Z', updatedAt: '2024-01-15T14:20:00Z', notes: [{ text: 'Interested in premium package', timestamp: '2024-01-15T14:20:00Z' }] },
  { id: '3', name: 'Rajesh Mehta', email: 'rajesh@gmail.com', phone: '+91 76543 21098', vertical: 'buy-leads', status: 'converted', source: 'meta', assignedTo: '3', createdAt: '2024-01-14T16:45:00Z', updatedAt: '2024-01-15T11:00:00Z', notes: [{ text: 'Initial call completed', timestamp: '2024-01-14T18:00:00Z' }, { text: 'Converted successfully, sent to vendors', timestamp: '2024-01-15T11:00:00Z' }] },
  { id: '4', name: 'Pooja Nair', email: 'pooja@gmail.com', phone: '+91 65432 10987', vertical: 'honeymoon', status: 'new', source: 'meta', assignedTo: null, createdAt: '2024-01-15T11:00:00Z', updatedAt: '2024-01-15T11:00:00Z', notes: [] },
  { id: '5', name: 'Suresh Iyer', email: 'suresh@gmail.com', phone: '+91 54321 09876', vertical: 'app-b2c', status: 'contacted', source: 'meta', assignedTo: '4', createdAt: '2024-01-14T14:20:00Z', updatedAt: '2024-01-15T09:30:00Z', notes: [{ text: 'Needs callback tomorrow', timestamp: '2024-01-15T09:30:00Z' }] },
  { id: '6', name: 'Kavitha Menon', email: 'kavitha@gmail.com', phone: '+91 43210 98765', vertical: 'wedding-sip', status: 'new', source: 'meta', assignedTo: null, createdAt: '2024-01-15T08:30:00Z', updatedAt: '2024-01-15T08:30:00Z', notes: [] },
  { id: '7', name: 'Arjun Verma', email: 'arjun@gmail.com', phone: '+91 32109 87654', vertical: 'hospitality', status: 'lost', source: 'meta', assignedTo: '5', createdAt: '2024-01-13T12:00:00Z', updatedAt: '2024-01-14T16:00:00Z', notes: [{ text: 'Not interested at this time', timestamp: '2024-01-14T16:00:00Z' }] },
  { id: '8', name: 'Divya Saxena', email: 'divya@gmail.com', phone: '+91 21098 76543', vertical: 'buy-leads', status: 'new', source: 'meta', assignedTo: null, createdAt: '2024-01-15T07:45:00Z', updatedAt: '2024-01-15T07:45:00Z', notes: [] },
  { id: '9', name: 'Kiran Rao', email: 'kiran@gmail.com', phone: '+91 10987 65432', vertical: 'wedding-course', status: 'converted', source: 'meta', assignedTo: '2', createdAt: '2024-01-12T15:30:00Z', updatedAt: '2024-01-14T10:00:00Z', notes: [{ text: 'Enrolled in course', timestamp: '2024-01-14T10:00:00Z' }] },
  { id: '10', name: 'Meera Joshi', email: 'meera@gmail.com', phone: '+91 09876 54321', vertical: 'app-b2b', status: 'contacted', source: 'meta', assignedTo: '1', createdAt: '2024-01-14T10:15:00Z', updatedAt: '2024-01-15T12:00:00Z', notes: [{ text: 'Demo scheduled for Friday', timestamp: '2024-01-15T12:00:00Z' }] },
];

export const mockVendors: Vendor[] = [
  { id: '1', businessName: 'Royal Wedding Planners', contactName: 'Anita Shah', email: 'anita@royalwedding.com', phone: '+91 98765 00001', category: 'Wedding Planner', isSubscribed: true, hasApp: true, joinedAt: '2023-06-15', location: 'Mumbai' },
  { id: '2', businessName: 'Sharma Caterers', contactName: 'Rakesh Sharma', email: 'rakesh@sharmacaterers.com', phone: '+91 98765 00002', category: 'Catering', isSubscribed: true, hasApp: true, joinedAt: '2023-07-20', location: 'Delhi' },
  { id: '3', businessName: 'Divine Decorators', contactName: 'Sunita Patel', email: 'sunita@divinedecor.com', phone: '+91 98765 00003', category: 'Decoration', isSubscribed: false, hasApp: true, joinedAt: '2023-08-10', location: 'Bangalore' },
  { id: '4', businessName: 'Lens Magic Photography', contactName: 'Vijay Kumar', email: 'vijay@lensmagic.com', phone: '+91 98765 00004', category: 'Photography', isSubscribed: true, hasApp: true, joinedAt: '2023-05-25', location: 'Chennai' },
  { id: '5', businessName: 'Melody Makers Band', contactName: 'Sunil Verma', email: 'sunil@melodymakers.com', phone: '+91 98765 00005', category: 'Entertainment', isSubscribed: false, hasApp: false, joinedAt: '2023-09-01', location: 'Hyderabad' },
  { id: '6', businessName: 'Bridal Boutique', contactName: 'Priya Malhotra', email: 'priya@bridalboutique.com', phone: '+91 98765 00006', category: 'Bridal Wear', isSubscribed: true, hasApp: true, joinedAt: '2023-04-18', location: 'Pune' },
  { id: '7', businessName: 'Grand Venue Hall', contactName: 'Ravi Agarwal', email: 'ravi@grandvenue.com', phone: '+91 98765 00007', category: 'Venue', isSubscribed: true, hasApp: true, joinedAt: '2023-03-12', location: 'Jaipur' },
  { id: '8', businessName: 'Sweet Delights', contactName: 'Kavita Gupta', email: 'kavita@sweetdelights.com', phone: '+91 98765 00008', category: 'Bakery', isSubscribed: false, hasApp: true, joinedAt: '2023-10-05', location: 'Kolkata' },
];

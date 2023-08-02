const getStatusColorClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-meta-3';
      case 'In Progress':
        return 'bg-meta-6';
      case 'Inactive':
        return 'bg-black';
      case 'Completed':
        return 'bg-success';
      case 'Closed':
        return 'bg-danger';
      default:
        return '';
    }
};

const getPriorityColorClass = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-danger text-whiten';
    case 'High':
      return 'bg-warning text-whiten';
    case 'Medium':
      return 'bg-meta-5 text-whiten';
    case 'Low':
      return 'bg-meta-3 text-whiten';
    default:
      return '';
  }
};

const colorClass = {
  getStatusColorClass,
  getPriorityColorClass
}

export default colorClass;
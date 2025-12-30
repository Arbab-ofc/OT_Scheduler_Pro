const ResourceManagement = () => (
  <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
    <h2 className="text-xl font-semibold mb-4">Resource Management</h2>
    <p className="text-text-secondary-light dark:text-text-secondary-dark">
      Track OT equipment, materials, and drugs. Integrate Firestore queries and Cloudinary for resource documents as needed.
    </p>
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      <div className="p-4 rounded-lg bg-primary/10">
        <p className="text-sm">Equipment</p>
        <p className="text-2xl font-bold">32</p>
      </div>
      <div className="p-4 rounded-lg bg-secondary/10">
        <p className="text-sm">Low Stock Alerts</p>
        <p className="text-2xl font-bold">3</p>
      </div>
      <div className="p-4 rounded-lg bg-accent/10">
        <p className="text-sm">Maintenance Due</p>
        <p className="text-2xl font-bold">2</p>
      </div>
    </div>
  </div>
);

export default ResourceManagement;

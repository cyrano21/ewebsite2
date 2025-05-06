import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Pagination,
  Badge,
  Modal,
  Collapse,
  ListGroup,
  ButtonGroup,
} from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/PageHeader";
import Link from "next/link";

export default function CustomerManagementPage() {
  // États pour gérer les clients et la pagination
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Nouveaux états pour le formulaire d'édition
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });
  // Nouvel état pour le modal d'ajout de client
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });
  // Nouveaux états pour les filtres avancés
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    minOrders: "",
    maxOrders: "",
    minSpent: "",
    maxSpent: "",
    dateFrom: "",
    dateTo: "",
    country: "",
  });

  // Chargement réel des clients depuis l'API
  useEffect(() => {
    setIsLoading(true);
    let params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.minOrders) params.append('minOrders', filters.minOrders);
    if (filters.maxOrders) params.append('maxOrders', filters.maxOrders);
    if (filters.minSpent) params.append('minSpent', filters.minSpent);
    if (filters.maxSpent) params.append('maxSpent', filters.maxSpent);
    fetch(`/api/users?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setCustomers(data.users || []);
        setIsLoading(false);
      })
      .catch(err => {
        setCustomers([]);
        setIsLoading(false);
      });
  }, [searchTerm, filters]);


  // Gérer les changements dans les filtres avancés
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Réinitialiser les filtres avancés
  const resetFilters = () => {
    setFilters({
      status: "all",
      minOrders: "",
      maxOrders: "",
      minSpent: "",
      maxSpent: "",
      dateFrom: "",
      dateTo: "",
      country: "",
    });
    // Appliquer les filtres réinitialisés
    applyFilters();
  };

  // Appliquer les filtres
  const applyFilters = () => {
    setCurrentPage(1); // Réinitialiser à la première page
  };

  // Filtrer les clients en fonction du terme de recherche et des filtres avancés
  const filteredCustomers = customers.filter((customer) => {
    // Vérifier le terme de recherche
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));

    if (!matchesSearch) return false;

    // Vérifier le statut
    if (filters.status !== "all" && customer.status !== filters.status) {
      return false;
    }

    // Vérifier le nombre de commandes
    if (
      filters.minOrders !== "" &&
      customer.orders < parseInt(filters.minOrders)
    ) {
      return false;
    }
    if (
      filters.maxOrders !== "" &&
      customer.orders > parseInt(filters.maxOrders)
    ) {
      return false;
    }

    // Vérifier le montant dépensé
    if (
      filters.minSpent !== "" &&
      customer.totalSpent < parseFloat(filters.minSpent)
    ) {
      return false;
    }
    if (
      filters.maxSpent !== "" &&
      customer.totalSpent > parseFloat(filters.maxSpent)
    ) {
      return false;
    }

    // Vérifier le pays de l'adresse
    if (
      filters.country !== "" &&
      (!customer.address ||
        customer.address.country.toLowerCase() !==
          filters.country.toLowerCase())
    ) {
      return false;
    }

    // Vérifier la date d'inscription
    if (filters.dateFrom !== "" || filters.dateTo !== "") {
      // Convertir les dates du format dd/mm/yyyy en objets Date
      const parts = customer.registeredDate.split("/");
      const customerDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );

      if (filters.dateFrom !== "") {
        const fromDate = new Date(filters.dateFrom);
        if (customerDate < fromDate) return false;
      }

      if (filters.dateTo !== "") {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // Fin de la journée
        if (customerDate > toDate) return false;
      }
    }

    return true;
  });

  // Calculer les indices pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ouvrir le modal avec les détails du client
  const openCustomerDetails = (customer) => {
    setCurrentCustomer(customer);
    setShowModal(true);
  };

  // Ouvrir le modal d'édition avec les données du client
  const openEditModal = (customer) => {
    setEditFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      status: customer.status || "Active",
      street: customer.address ? customer.address.street : "",
      city: customer.address ? customer.address.city : "",
      zipCode: customer.address ? customer.address.zipCode : "",
      country: customer.address ? customer.address.country : "",
    });
    setCurrentCustomer(customer);
    setShowEditModal(true);
  };

  // Gérer les changements dans le formulaire d'édition
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Soumettre le formulaire d'édition
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedCustomer = {
        ...currentCustomer,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        status: editFormData.status,
        address: {
          street: editFormData.street,
          city: editFormData.city,
          zipCode: editFormData.zipCode,
          country: editFormData.country,
        },
      };

      // Appel API (en production)
      /* const response = await fetch(`/api/users/${currentCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du client');
      } */

      // Pour la démonstration, mise à jour locale des données
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === currentCustomer.id ? updatedCustomer : customer
        )
      );

      // Mettre à jour le client actuel si le modal de détails est ouvert
      setCurrentCustomer(updatedCustomer);

      // Fermer le modal d'édition
      setShowEditModal(false);

      // Afficher un message de succès (vous pouvez utilser une notification toast)
      alert("Le client a été mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      alert("Erreur lors de la mise à jour du client. Veuillez réessayer.");
    }
  };

  // Gérer les changements dans le formulaire d'ajout
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Soumettre le formulaire d'ajout
  const handleAddFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Générer un nouvel ID (dans un environnement réel, cela serait fait par le serveur)
      const newId = Math.max(...customers.map((c) => c.id), 0) + 1;

      const newCustomer = {
        id: newId,
        name: newCustomerData.name,
        email: newCustomerData.email,
        phone: newCustomerData.phone,
        status: newCustomerData.status,
        registeredDate: new Date().toLocaleDateString("fr-FR"), // Date actuelle
        orders: 0,
        totalSpent: 0,
        address: {
          street: newCustomerData.street,
          city: newCustomerData.city,
          zipCode: newCustomerData.zipCode,
          country: newCustomerData.country,
        },
      };

      // Appel API (en production)
      /* const response = await fetch(`/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du client');
      }
      
      // Récupérer le client créé avec l'ID généré par le serveur
      const createdCustomer = await response.json(); */

      // Pour la démonstration, ajouter directement le client à la liste
      setCustomers([newCustomer, ...customers]);

      // Réinitialiser le formulaire
      setNewCustomerData({
        name: "",
        email: "",
        phone: "",
        status: "Active",
        street: "",
        city: "",
        zipCode: "",
        country: "",
      });

      // Fermer le modal
      setShowAddModal(false);

      // Afficher un message de succès
      alert("Le client a été ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      alert("Erreur lors de l'ajout du client. Veuillez réessayer.");
    }
  };

  // Gestionnaire de recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
  };

  // Supprimer un client
  const handleDeleteCustomer = async (customerId) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
      )
    ) {
      try {
        const response = await fetch(`/api/users/${customerId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Filtrer le client supprimé
          setCustomers(
            customers.filter((customer) => customer.id !== customerId)
          );
        } else {
          alert("Erreur lors de la suppression du client. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur de connexion au serveur");
      }
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Gestion des clients" curPage="Admin / Clients" />

      <Container fluid className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center mb-3">
              <Col>
                <h5 className="mb-0">Liste des clients</h5>
              </Col>
              <Col xs="auto">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="icofont-plus-circle me-1"></i> Ajouter un client
                </Button>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <InputGroup>
                  <Form.Control
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Button variant="outline-secondary">
                    <i className="icofont-search-1"></i>
                  </Button>
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filters.status}
                  name="status"
                  onChange={handleFilterChange}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Active">Actif</option>
                  <option value="Inactive">Inactif</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                >
                  <i
                    className={`icofont-filter me-1 ${
                      showFilters ? "text-primary" : ""
                    }`}
                  ></i>
                  Filtres avancés
                  {showFilters ? (
                    <i className="icofont-simple-up ms-2"></i>
                  ) : (
                    <i className="icofont-simple-down ms-2"></i>
                  )}
                </Button>
              </Col>
            </Row>

            <Collapse in={showFilters}>
              <Card className="border-light shadow-sm mb-4">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Filtres avancés</h6>
                  <Button variant="link" size="sm" onClick={resetFilters}>
                    Réinitialiser
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 align-items-end">
                    <Col md={2}>
                      <Form.Group controlId="filterMinOrders">
                        <Form.Label>Min commandes</Form.Label>
                        <Form.Control
                          type="number"
                          name="minOrders"
                          value={filters.minOrders}
                          onChange={handleFilterChange}
                          placeholder="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group controlId="filterMaxOrders">
                        <Form.Label>Max commandes</Form.Label>
                        <Form.Control
                          type="number"
                          name="maxOrders"
                          value={filters.maxOrders}
                          onChange={handleFilterChange}
                          placeholder="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group controlId="filterMinSpent">
                        <Form.Label>Min dépensé (€)</Form.Label>
                        <Form.Control
                          type="number"
                          name="minSpent"
                          value={filters.minSpent}
                          onChange={handleFilterChange}
                          placeholder="0"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group controlId="filterMaxSpent">
                        <Form.Label>Max dépensé (€)</Form.Label>
                        <Form.Control
                          type="number"
                          name="maxSpent"
                          value={filters.maxSpent}
                          onChange={handleFilterChange}
                          placeholder="0"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group controlId="filterDateFrom">
                        <Form.Label>De</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateFrom"
                          value={filters.dateFrom}
                          onChange={handleFilterChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group controlId="filterDateTo">
                        <Form.Label>À</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateTo"
                          value={filters.dateTo}
                          onChange={handleFilterChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs="auto">
                      <Button variant="primary" onClick={applyFilters}>
                        Appliquer
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Collapse>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Inscription</th>
                        <th>Commandes</th>
                        <th>Total dépensé</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((customer) => (
                          <tr key={`customer-${customer.id}`}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone || "-"}</td>
                            <td>{customer.registeredDate}</td>
                            <td>{customer.orders}</td>
                            <td>
                              {customer.totalSpent !== undefined
                                ? customer.totalSpent.toFixed(2)
                                : "0.00"}{" "}
                              €
                            </td>
                            <td>
                              <Badge
                                bg={
                                  customer.status === "Active"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {customer.status === "Active"
                                  ? "Actif"
                                  : "Inactif"}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                variant="link"
                                className="p-0 me-2"
                                onClick={() => openCustomerDetails(customer)}
                              >
                                <i className="icofont-eye-alt text-primary"></i>
                              </Button>
                              <Button
                                variant="link"
                                className="p-0 me-2"
                                onClick={() => openEditModal(customer)}
                              >
                                <i className="icofont-edit text-secondary"></i>
                              </Button>
                              <Button
                                variant="link"
                                className="p-0"
                                onClick={() =>
                                  handleDeleteCustomer(customer.id)
                                }
                              >
                                <i className="icofont-trash text-danger"></i>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key="no-customers-found">
                          <td colSpan="9" className="text-center py-4">
                            Aucun client trouvé correspondant à votre recherche.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    Affichage de {indexOfFirstItem + 1} à{" "}
                    {Math.min(indexOfLastItem, filteredCustomers.length)} sur{" "}
                    {filteredCustomers.length} clients
                  </div>

                  <Pagination>
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((current) => Math.max(current - 1, 1))
                      }
                      disabled={currentPage === 1}
                    />

                    {[
                      ...Array(
                        Math.ceil(filteredCustomers.length / itemsPerPage)
                      ).keys(),
                    ].map((number) => (
                      <Pagination.Item
                        key={`page-${number + 1}`}
                        active={number + 1 === currentPage}
                        onClick={() => paginate(number + 1)}
                      >
                        {number + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((current) =>
                          Math.min(
                            current + 1,
                            Math.ceil(filteredCustomers.length / itemsPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredCustomers.length / itemsPerPage)
                      }
                    />
                  </Pagination>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal de détails du client */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="icofont-user-alt-7 me-2 text-primary"></i>
            Détails du client
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {currentCustomer && (
            <>
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div className="bg-light rounded-circle p-3 me-3">
                  <i className="icofont-user-alt-5 fs-2 text-primary"></i>
                </div>
                <div>
                  <h4 className="mb-1">{currentCustomer.name}</h4>
                  <p className="text-muted mb-0">
                    Client depuis {currentCustomer.registeredDate}
                  </p>
                </div>
                <Badge
                  bg={
                    currentCustomer.status === "Active"
                      ? "success"
                      : "secondary"
                  }
                  className="ms-auto px-3 py-2"
                >
                  {currentCustomer.status === "Active" ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <Row>
                <Col md={6}>
                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <i className="icofont-info-circle me-2 text-primary"></i>
                        Informations personnelles
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Email</span>
                          <span className="fw-medium">
                            {currentCustomer.email}
                          </span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Téléphone</span>
                          <span className="fw-medium">
                            {currentCustomer.phone || "Non renseigné"}
                          </span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">ID Client</span>
                          <span className="fw-medium">
                            {currentCustomer.id}
                          </span>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>

                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <i className="icofont-location-pin me-2 text-primary"></i>
                        Adresse
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      {currentCustomer.address ? (
                        <address className="mb-0">
                          <p className="mb-1 fw-medium">
                            {currentCustomer.address.street}
                          </p>
                          <p className="mb-1">
                            {currentCustomer.address.zipCode}{" "}
                            {currentCustomer.address.city}
                          </p>
                          <p className="mb-0">
                            {currentCustomer.address.country}
                          </p>
                        </address>
                      ) : (
                        <p className="text-muted mb-0">
                          Aucune adresse enregistrée
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="shadow-sm mb-4 border-primary border-top border-3">
                    <Card.Body>
                      <h5 className="card-title mb-3">
                        <i className="icofont-chart-histogram me-2 text-primary"></i>
                        Statistiques
                      </h5>
                      <div className="row g-0 text-center mb-3">
                        <div className="col-4 border-end">
                          <h3 className="mb-1">{currentCustomer.orders}</h3>
                          <p className="text-muted small mb-0">Commandes</p>
                        </div>
                        <div className="col-4 border-end">
                          <h3 className="mb-1">
                            {currentCustomer.totalSpent !== undefined
                              ? currentCustomer.totalSpent.toFixed(2)
                              : "0.00"}{" "}
                            €
                          </h3>
                          <p className="text-muted small mb-0">Total dépensé</p>
                        </div>
                        <div className="col-4">
                          <h3 className="mb-1">
                            {currentCustomer.orders > 0 &&
                            currentCustomer.totalSpent !== undefined
                              ? (
                                  currentCustomer.totalSpent /
                                  currentCustomer.orders
                                ).toFixed(2)
                              : "0.00"}{" "}
                            €
                          </h3>
                          <p className="text-muted small mb-0">Panier moyen</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <i className="icofont-shopping-cart me-2 text-primary"></i>
                        Dernières commandes
                      </h5>
                      {currentCustomer.orders > 0 && (
                        <Link
                          href={`/admin/orders?customer=${currentCustomer.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Toutes les commandes
                        </Link>
                      )}
                    </Card.Header>
                    <Card.Body className="p-0">
                      {currentCustomer.orders > 0 ? (
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                            <div>
                              <p className="mb-1 fw-bold">Commande #1234</p>
                              <div className="d-flex align-items-center">
                                <span className="badge bg-success me-2">
                                  Livré
                                </span>
                                <small className="text-muted">
                                  12/04/2025 - 3 produits
                                </small>
                              </div>
                            </div>
                            <span className="fw-medium">129.99 €</span>
                          </ListGroup.Item>

                          {currentCustomer.orders > 1 && (
                            <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                              <div>
                                <p className="mb-1 fw-bold">Commande #1189</p>
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-success me-2">
                                    Livré
                                  </span>
                                  <small className="text-muted">
                                    28/03/2025 - 2 produits
                                  </small>
                                </div>
                              </div>
                              <span className="fw-medium">89.50 €</span>
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      ) : (
                        <p className="text-muted text-center p-3 mb-0">
                          Aucune commande passée.
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
          >
            Fermer
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              openEditModal(currentCustomer);
              setShowModal(false);
            }}
          >
            <i className="icofont-edit me-1"></i>
            Modifier le client
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal d'édition du client */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="icofont-edit me-2 text-primary"></i>
            Modifier le client
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditFormSubmit}>
          <Modal.Body className="p-4">
            {currentCustomer && (
              <Row>
                <Col md={6}>
                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <i className="icofont-info-circle me-2 text-primary"></i>
                        Informations personnelles
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Nom complet</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditFormChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={editFormData.phone}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Statut</Form.Label>
                        <Form.Select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditFormChange}
                        >
                          <option value="Active">Actif</option>
                          <option value="Inactive">Inactif</option>
                        </Form.Select>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <i className="icofont-location-pin me-2 text-primary"></i>
                        Adresse
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Rue</Form.Label>
                        <Form.Control
                          type="text"
                          name="street"
                          value={editFormData.street}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Ville</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={editFormData.city}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Code postal</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={editFormData.zipCode}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Pays</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={editFormData.country}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button
              variant="outline-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Annuler
            </Button>
            <Button variant="success" type="submit">
              <i className="icofont-save me-1"></i>
              Enregistrer les modifications
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal d'ajout de client */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="icofont-plus-circle me-2 text-primary"></i>
            Ajouter un nouveau client
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddFormSubmit}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <i className="icofont-info-circle me-2 text-primary"></i>
                      Informations personnelles
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom complet*</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={newCustomerData.name}
                        onChange={handleAddFormChange}
                        required
                        placeholder="Ex: Jean Dupont"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email*</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={newCustomerData.email}
                        onChange={handleAddFormChange}
                        required
                        placeholder="Ex: jean.dupont@example.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={newCustomerData.phone}
                        onChange={handleAddFormChange}
                        placeholder="Ex: 01 23 45 67 89"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Statut</Form.Label>
                      <Form.Select
                        name="status"
                        value={newCustomerData.status}
                        onChange={handleAddFormChange}
                      >
                        <option value="Active">Actif</option>
                        <option value="Inactive">Inactif</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <i className="icofont-location-pin me-2 text-primary"></i>
                      Adresse
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Rue</Form.Label>
                      <Form.Control
                        type="text"
                        name="street"
                        value={newCustomerData.street}
                        onChange={handleAddFormChange}
                        placeholder="Ex: 123 Rue de Paris"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Ville</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={newCustomerData.city}
                        onChange={handleAddFormChange}
                        placeholder="Ex: Paris"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Code postal</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={newCustomerData.zipCode}
                        onChange={handleAddFormChange}
                        placeholder="Ex: 75001"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Pays</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={newCustomerData.country}
                        onChange={handleAddFormChange}
                        placeholder="Ex: France"
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <p className="text-muted small">* Champs obligatoires</p>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button
              variant="outline-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Annuler
            </Button>
            <Button variant="success" type="submit">
              <i className="icofont-save me-1"></i>
              Créer le client
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </AdminLayout>
  );
}

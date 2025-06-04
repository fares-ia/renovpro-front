import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { dataStore, type Service, type Realization, type Review, type Quote } from "@/store/dataStore";
import AdminServices from "@/components/admin/AdminServices";
import AdminRealizations from "@/components/admin/AdminRealizations";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminQuotes from "@/components/admin/AdminQuotes";

const API_URL = "http://localhost:4000/api/auth";

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [stats, setStats] = useState({
    pendingQuotes: 0,
    totalQuotes: 0,
    services: 0,
    realizations: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(false);

  // Vérification du token au chargement
  useEffect(() => {
    const token = localStorage.getItem("renovpro_token");
    if (token) {
      setLoading(true);
      fetch(`${API_URL}/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw await res.json();
          return res.json();
        })
        .then((data) => {
          if (data.valid) setIsAuthenticated(true);
          else setIsAuthenticated(false);
        })
        .catch(() => setIsAuthenticated(false))
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const [quotes, services, realizations, reviews] = await Promise.all([
        dataStore.getQuotes(),
        dataStore.getServices(),
        dataStore.getRealizations(),
        dataStore.getReviews()
      ]);

      setStats({
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
        totalQuotes: quotes.length,
        services: services.length,
        realizations: realizations.length,
        reviews: reviews.length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Authentification via API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      localStorage.setItem("renovpro_token", data.token);
      setIsAuthenticated(true);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.user.username}`,
      });
    } catch (err: any) {
      toast({
        title: "Erreur de connexion",
        description: err?.error?.message || "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem("renovpro_token");
    setLoading(true);
    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
        });
      }
    } catch {}
    localStorage.removeItem("renovpro_token");
    setIsAuthenticated(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-lg text-gray-700">Chargement...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Administration RenovPro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Administration RenovPro</h1>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="realizations">Réalisations</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
            <TabsTrigger value="quotes">Devis</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Devis en attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-500">{stats.pendingQuotes}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total devis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-500">{stats.totalQuotes}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">{stats.services}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Réalisations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-500">{stats.realizations}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <AdminServices onUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="realizations">
            <AdminRealizations onUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews onUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="quotes">
            <AdminQuotes onUpdate={loadStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

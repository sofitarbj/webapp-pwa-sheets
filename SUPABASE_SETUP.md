# Configuration Supabase - Sheets Manager

Ce document explique comment configurer Supabase pour l'application Sheets Manager.

## 📊 Schéma de base de données

### Table `users` (optionnelle)

Cette table peut être utilisée pour stocker des métadonnées supplémentaires sur les utilisateurs.

```sql
-- Créer la table users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  google_id TEXT,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir uniquement leurs propres données
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres données
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Politique : Insertion automatique lors de la création du compte
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Trigger pour créer automatiquement le profil

```sql
-- Fonction pour créer le profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, google_id, display_name, photo_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'sub',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur la création d'un nouvel utilisateur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Fonction pour mettre à jour last_login

```sql
-- Fonction pour mettre à jour la date de dernière connexion
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET last_login = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur la connexion
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.update_last_login();
```

## 🔐 Configuration Google OAuth

### 1. Dans Supabase Dashboard

1. Allez dans **Authentication** → **Providers**
2. Activez **Google**
3. Remplissez les champs :
   - **Client ID** : Votre Client ID Google
   - **Client Secret** : Votre Client Secret Google
4. **IMPORTANT** : Dans **Additional Scopes**, ajoutez :
   ```
   https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly
   ```

### 2. URLs de redirection

Ajoutez ces URLs dans votre configuration Google Cloud :

**Développement :**
```
http://localhost:3000/auth/callback
```

**Production :**
```
https://votre-domaine.vercel.app/auth/callback
```

### 3. Récupérer l'URL de callback Supabase

Dans Supabase, l'URL de callback est :
```
https://votre-projet.supabase.co/auth/v1/callback
```

Ajoutez cette URL dans les **URI de redirection autorisées** de votre projet Google Cloud.

## 🔑 Variables d'environnement

Récupérez ces valeurs depuis votre projet Supabase :

### Supabase URL
Allez dans **Settings** → **API** → **Project URL**

### Supabase Anon Key
Allez dans **Settings** → **API** → **Project API keys** → **anon public**

## ⚙️ Configuration avancée

### Personnaliser les métadonnées utilisateur

Vous pouvez ajouter des colonnes supplémentaires à la table `users` :

```sql
ALTER TABLE public.users
ADD COLUMN preferences JSONB DEFAULT '{}',
ADD COLUMN theme TEXT DEFAULT 'light';
```

### Logs de connexion

Pour suivre les connexions :

```sql
CREATE TABLE public.login_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON public.login_logs
  FOR SELECT
  USING (auth.uid() = user_id);
```

## 🧪 Test de la configuration

Pour tester que tout fonctionne :

1. Lancez l'application en local
2. Cliquez sur "Continuer avec Google"
3. Autorisez l'accès aux Google Sheets
4. Vérifiez dans Supabase Dashboard → **Authentication** → **Users** que l'utilisateur est créé
5. Vérifiez dans **Table Editor** → **users** que le profil est créé

## 🔒 Sécurité

### Row Level Security (RLS)

Toujours activer RLS sur vos tables :

```sql
ALTER TABLE nom_de_table ENABLE ROW LEVEL SECURITY;
```

### Politiques recommandées

- **SELECT** : L'utilisateur peut voir uniquement ses données
- **INSERT** : L'utilisateur peut créer uniquement ses données
- **UPDATE** : L'utilisateur peut modifier uniquement ses données
- **DELETE** : L'utilisateur peut supprimer uniquement ses données

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth avec Supabase](https://supabase.com/docs/guides/auth/social-login/auth-google)

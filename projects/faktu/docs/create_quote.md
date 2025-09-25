---
title: "Création d'un devis"
summary: "Guide complet pour créer un devis professionnel : étapes, informations requises, calculs et finalisation du document commercial."
tags: ["création", "devis"]
last_update: "2025-09-22"
---

# Création d'un devis

## Vue d'ensemble

Un devis est un document commercial essentiel qui présente une offre détaillée à un client potentiel. Ce guide vous accompagne dans toutes les étapes de création d'un devis professionnel dans l'application.

## 🎯 Objectifs

- Créer un devis professionnel et complet
- Calculer automatiquement les montants et taxes
- Générer un document PDF prêt à envoyer
- Suivre le statut du devis jusqu'à sa conversion

## 📍 Où créer un devis

### Navigation vers la création

1. **Depuis le menu principal** : 
   - Cliquez sur "Devis" dans la barre de navigation
   - Sélectionnez "Nouveau devis" ou cliquez sur le bouton "+"

2. **Depuis un client existant** :
   - Accédez à la fiche client
   - Cliquez sur l'onglet "Devis"
   - Sélectionnez "Créer un devis"

3. **Depuis un projet** :
   - Ouvrez le projet concerné
   - Cliquez sur "Actions" → "Créer un devis"

## ✅ Prérequis

Avant de créer un devis, assurez-vous d'avoir :

### Informations client
- [ ] **Client créé** dans la base de données
- [ ] **Coordonnées complètes** (nom, adresse, SIRET si entreprise)
- [ ] **Contact principal** avec email et téléphone
- [ ] **Conditions de paiement** définies

### Informations produits/services
- [ ] **Catalogue produits** à jour avec prix
- [ ] **Services** définis avec tarifs
- [ ] **Taux de TVA** configurés
- [ ] **Conditions commerciales** établies

### Configuration système
- [ ] **Numérotation automatique** activée
- [ ] **Modèle de devis** sélectionné
- [ ] **Signature électronique** configurée (optionnel)

## 🛠️ Processus de création étape par étape

### Étape 1 : Informations générales

1. **Sélection du client**
   - Choisissez le client dans la liste déroulante
   - Ou créez un nouveau client si nécessaire
   - Vérifiez que les coordonnées sont correctes

2. **Paramètres du devis**
   - **Numéro** : Généré automatiquement ou saisissable manuellement
   - **Date d'émission** : Date du jour par défaut
   - **Date de validité** : Calculée automatiquement (30 jours par défaut)
   - **Référence projet** : Optionnelle mais recommandée

### Étape 2 : Ajout des lignes

#### Ajouter des produits
1. Cliquez sur "Ajouter une ligne"
2. Sélectionnez "Produit" dans le catalogue
3. Ajustez la quantité si nécessaire
4. Le prix unitaire se remplit automatiquement
5. Modifiez la remise si applicable

#### Ajouter des services
1. Cliquez sur "Ajouter une ligne"
2. Sélectionnez "Service" ou saisissez une description libre
3. Définissez la quantité (heures, jours, forfait)
4. Saisissez le prix unitaire
5. Appliquez une remise si nécessaire

#### Ajouter des sections
- Utilisez les sections pour organiser votre devis
- Ajoutez des titres et descriptions pour clarifier l'offre
- Groupez les éléments par thématique

### Étape 3 : Calculs et totaux

Les calculs se font automatiquement :
- **Sous-total** : Somme des lignes HT
- **Remises globales** : Pourcentage ou montant fixe
- **TVA** : Calculée selon les taux configurés
- **Total TTC** : Montant final à payer

### Étape 4 : Options avancées

#### Conditions commerciales
- **Délai de livraison** : Précisez les délais
- **Modalités de paiement** : Acompte, échéances
- **Garanties** : Conditions de garantie
- **Validité** : Durée de validité de l'offre

#### Documents joints
- Ajoutez des pièces jointes (plans, photos, documentation)
- Formats acceptés : PDF, JPG, PNG, DOC, XLS

### Étape 5 : Finalisation

1. **Vérification**
   - Relisez toutes les informations
   - Vérifiez les calculs
   - Contrôlez l'orthographe

2. **Aperçu**
   - Générez un aperçu PDF
   - Vérifiez la mise en page
   - Contrôlez que toutes les informations sont présentes

3. **Sauvegarde**
   - Sauvegardez le devis
   - Le statut passe à "Brouillon"

## 📋 Informations nécessaires

### Informations obligatoires

#### Concernant l'entreprise émettrice
- Raison sociale complète
- Adresse du siège social
- SIRET/SIREN
- Code APE
- Numéro de TVA intracommunautaire
- Capital social (si SA/SARL)

#### Concernant le client
- Nom/Raison sociale
- Adresse complète de facturation
- Adresse de livraison (si différente)
- SIRET (pour les entreprises)

#### Contenu commercial
- Description détaillée des produits/services
- Quantités
- Prix unitaires HT
- Taux de TVA applicables
- Total HT, TVA et TTC

### Informations recommandées

- **Référence de commande** client
- **Interlocuteur** chez le client
- **Délai de livraison** ou d'exécution
- **Modalités de paiement**
- **Conditions générales de vente**
- **Durée de validité** de l'offre

### Informations optionnelles

- Logo de l'entreprise
- Signature manuscrite ou électronique
- Cachet de l'entreprise
- Photos ou schémas explicatifs
- Conditions particulières

## ⚠️ Gestion des erreurs courantes

### Erreur : "Client introuvable"
**Cause** : Le client sélectionné n'existe plus ou a été supprimé
**Solution** :
1. Vérifiez que le client existe dans la base
2. Créez un nouveau client si nécessaire
3. Contactez l'administrateur si le problème persiste

### Erreur : "Produit non disponible"
**Cause** : Le produit n'est plus dans le catalogue ou est désactivé
**Solution** :
1. Vérifiez le statut du produit dans le catalogue
2. Réactivez le produit si nécessaire
3. Remplacez par un produit équivalent

### Erreur : "Calcul de TVA impossible"
**Cause** : Taux de TVA non configuré ou incorrect
**Solution** :
1. Vérifiez la configuration des taux de TVA
2. Assignez le bon taux au produit/service
3. Contactez l'administrateur pour la configuration

### Erreur : "Numérotation bloquée"
**Cause** : Conflit dans la numérotation automatique
**Solution** :
1. Vérifiez les paramètres de numérotation
2. Saisissez un numéro manuellement
3. Contactez le support technique

### Erreur : "Sauvegarde impossible"
**Cause** : Champs obligatoires manquants ou erreur technique
**Solution** :
1. Vérifiez que tous les champs obligatoires sont remplis
2. Contrôlez votre connexion internet
3. Tentez une nouvelle sauvegarde
4. Contactez le support si le problème persiste

### Problème : "PDF non généré"
**Cause** : Erreur dans le moteur de génération PDF
**Solution** :
1. Vérifiez que le modèle de devis est configuré
2. Contrôlez que toutes les données sont complètes
3. Essayez de régénérer le PDF
4. Utilisez un autre modèle temporairement

## 📊 Statuts du devis

- **Brouillon** : Devis en cours de création, non finalisé
- **En attente** : Devis envoyé au client, en attente de réponse
- **Accepté** : Client a accepté le devis
- **Refusé** : Client a refusé l'offre
- **Expiré** : Date de validité dépassée
- **Annulé** : Devis annulé par l'entreprise

## 🚀 Conseils et bonnes pratiques

### Pour un devis efficace
- **Soyez précis** dans les descriptions
- **Structurez** votre offre avec des sections claires
- **Mettez en avant** les avantages de votre offre
- **Personnalisez** selon le client et ses besoins

### Pour éviter les erreurs
- **Double-vérification** des prix et calculs
- **Relecture** attentive avant envoi
- **Test d'impression** PDF avant finalisation
- **Sauvegarde régulière** pendant la création

### Pour un suivi optimal
- **Notifiez** automatiquement le client
- **Programmez** des rappels de relance
- **Trackez** les ouvertures et consultations
- **Analysez** les taux de conversion

## 📞 Support et aide

En cas de difficulté :
1. Consultez la FAQ intégrée
2. Utilisez le chat support en ligne
3. Contactez l'assistance technique : support@votreapp.com
4. Consultez les tutoriels vidéo dans l'aide

---

*Ce guide est régulièrement mis à jour. Pour toute suggestion d'amélioration, contactez l'équipe documentation.*


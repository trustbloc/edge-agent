/*
Copyright SecureKey Technologies Inc. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

package oidc

import (
	"encoding/json"
)

type createKeystoreReq struct {
	Controller string `json:"controller,omitempty"`
	VaultID    string `json:"vaultID,omitempty"`
}

type createKeyReq struct {
	KeyType string `json:"keyType,omitempty"`
}

type exportKeyResp struct {
	PublicKey string `json:"publicKey,omitempty"`
}

type updateCapabilityReq struct {
	EDVCapability json.RawMessage `json:"edvCapability,omitempty"`
}

type signReq struct {
	Message string `json:"message,omitempty"`
}

type signResp struct {
	Signature string `json:"signature,omitempty"`
}

// BootstrapData user bootsrap data.
// TODO to be refactored for universal wallet migration.
type BootstrapData struct {
	User              string `json:"user,omitempty"`
	UserEDVVaultURL   string `json:"edvVaultURL,omitempty"` // TODO remove this
	OpsEDVVaultURL    string `json:"opsVaultURL,omitempty"` // TODO remove this
	AuthzKeyStoreURL  string `json:"authzKeyStoreURL,omitempty"`
	OpsKeyStoreURL    string `json:"opsKeyStoreURL,omitempty"`
	EDVOpsKIDURL      string `json:"edvOpsKIDURL,omitempty"`
	EDVHMACKIDURL     string `json:"edvHMACKIDURL,omitempty"`
	UserEDVCapability string `json:"edvCapability,omitempty"`
	OPSKMSCapability  string `json:"opsKMSCapability,omitempty"` // TODO remove this
	UserEDVServer     string `json:"userEDVServer,omitempty"`
	UserEDVVaultID    string `json:"userEDVVaultID,omitempty"`
	UserEDVEncKID     string `json:"userEDVEncKID,omitempty"`
	UserEDVMACKID     string `json:"userEDVMACKID,omitempty"`
	TokenExpiry       string `json:"tokenExpiry,omitempty"`
}

type userBootstrapData struct {
	Data *BootstrapData `json:"data,omitempty"`
}

type secretRequest struct {
	Secret []byte `json:"secret,omitempty"`
}

type hubKMSHeader struct {
	secretShare string
	userSub     string
	accessToken string
}

type userConfig struct {
	AccessToken string `json:"accessToken,omitempty"`
	SecretShare string `json:"walletSecretShare,omitempty"`
}

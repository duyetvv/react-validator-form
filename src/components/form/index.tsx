import React from "react";

export type FormProps = {
  onSubmit: () => void;
  children: React.ReactNode;
};

export default function Form({ onSubmit, children }: FormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return <form onSubmit={handleSubmit}>{children}</form>;
}
